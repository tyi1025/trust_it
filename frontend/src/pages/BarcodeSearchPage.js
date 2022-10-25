import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { BrowserBarcodeReader } from '@zxing/library';
import ReactCrop from 'react-image-crop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes, faCheck, faUndo, faRedo
} from '@fortawesome/free-solid-svg-icons';

import Loading from '../components/Loading';
import UserHeader from '../connectedComponents/UserHeader';
import { updateBarcode, getProductByBarcode } from '../actions/product';
import { showMessage } from '../actions/interface';

import { useNavigate } from 'react-router-dom';

import 'react-image-crop/src/ReactCrop.scss';


import { Button, Form } from 'react-bootstrap';
import '../scss/BarcodeSearch.scss';


const BarcodeSearchPage = function(props) {
  const {
    barcode, updateBarcode, product, getProductByBarcode,
    getProductByBarcodeLoading, showMessage
  } = props;

  const [barcodeNumberImagePreview, setBarcodeNumberImagePreview] = useState(null);
  const [barcodeNumberImage, setBarcodeNumberImage] = useState(null);
  const [crop, setCrop] = useState(
    {unit: '%', width: 100, height: 100, x: 0, y: 0});
  const [barcodeRequestSent, setBarcodeRequestSent] = useState(false);

  const navigate = useNavigate();
  const barcodeImageInput = useRef(null);

  useEffect(() => {
    if (barcodeRequestSent && product && Object.keys(product).length !== 0) {
      navigate('/product/' + product._id);
    } else if (barcodeRequestSent && (!product || (product && product.length === 0))) {
      showMessage('No product with this barcode found');
    }
  }, [product]);

  function getCroppedImage(image, crop) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');


    if (crop.x && crop.y && crop.width && crop.height) {
      canvas.width = crop.width;
      canvas.height = crop.height;
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    } else {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg');
    });
  }

  function renderBarcodeNumberImagePreview() {
    if (barcodeNumberImagePreview) {
      return (
        <div className="barcode-image-preview-container">
          <div className="rotate-btns-container">
            <button
              className="btn rotate-btn"
              onClick={() => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const image = new Image();
                image.onload = function () {
                  canvas.width = image.height;
                  canvas.height = image.width;
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  context.save();
                  context.translate(canvas.width / 2, canvas.height / 2);
                  context.rotate(-Math.PI / 2);
                  context.drawImage(image, -image.width / 2, -image.height / 2);
                  context.restore();

                  setBarcodeNumberImagePreview(canvas.toDataURL('image/png', 1));
                  setCrop({});
                };
                image.src = barcodeNumberImagePreview;
              }}>
              <FontAwesomeIcon className="close-btn" icon={faUndo} />
            </button>
            <button
              className="btn rotate-btn"
              onClick={() => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const image = new Image();
                image.onload = function () {
                  canvas.width = image.height;
                  canvas.height = image.width;
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  context.save();
                  context.translate(canvas.width / 2, canvas.height / 2);
                  context.rotate(Math.PI / 2);
                  context.drawImage(image, -image.width / 2, -image.height / 2);
                  context.restore();

                  setBarcodeNumberImagePreview(canvas.toDataURL('image/png', 1));
                  setCrop({});
                };
                image.src = barcodeNumberImagePreview;
              }}>
              <FontAwesomeIcon className="close-btn" icon={faRedo} />
            </button>
          </div>
          <ReactCrop
            crop={crop} onChange={c => setCrop(c)}>
            <img
              src={barcodeNumberImagePreview}
              onLoad={(e) => {
                setBarcodeNumberImage(e.target);
              }} />
          </ReactCrop>
          <div className="image-preview-btn-container">
            <button
              className="btn cancel-btn"
              onClick={() => {
                setBarcodeNumberImagePreview(null);
              }}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <button
              className="btn confirm-btn"
              onClick={() => {
                getCroppedImage(barcodeNumberImage, crop).then((blob) => {
                  setBarcodeNumberImagePreview(null);
                  const reader = new FileReader();
                  reader.readAsDataURL(blob);
                  reader.onloadend = function () {
                    var image = document.createElement('img');
                    image.src = reader.result;
                    const codeReader = new BrowserBarcodeReader();
                    codeReader.decodeFromImage(image).then((result) => {
                      if (result) {
                        updateBarcode(result.text);
                      }
                    });
                  };
                });
              }}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <React.Fragment>
      <UserHeader />
      <div className='barcodesearchcontainer'>
        <div className='boxparent'>
          <div className='box'>
            <div className='barcode-number'>
              <div className='barcode-number-text'>Barcode number:</div>
              <Form.Control
                className='barcode-number-input'
                type="text"
                placeholder='Enter barcode number...'
                value={barcode}
                onChange={(e) => {
                  updateBarcode(e.target.value);
                }}
              /></div>
            <div className='normaltext-or'> Or </div>
            <div className='barcode-upload'>
              <div className='barcode-upload-text'>Upload barcode image:</div>
              <Form.Control
                className='barcode-upload-input'
                type="file"
                ref={barcodeImageInput}
                accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
                onClick={(event) => {
                  event.target.value = null;
                }}
                onChange={(event) => {
                  setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
                  setBarcodeNumberImagePreview(URL.createObjectURL(event.target.files[0]));
                }} />
            </div>
            <div className='div-search-button'>
              <Button
                className="search-button"
                onClick={() => {
                  if (barcode) {
                    setBarcodeRequestSent(true);
                    getProductByBarcode(barcode);
                  } else {
                    showMessage('Please enter a barcode');
                  }
                }}><div >Search </div></Button>
            </div>
          </div>
        </div>

        {renderBarcodeNumberImagePreview()}
      </div>
      {getProductByBarcodeLoading && <Loading />}
    </React.Fragment>
  );
};

const mapStateToProps = function(state) {
  return {
    barcode: state.product.barcode,
    product: state.product.productDetails,
    getProductByBarcodeLoading: state.product.getProductByBarcodeLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateBarcode: (barcode) => {
      dispatch(updateBarcode({barcode}));
    },
    getProductByBarcode: (barcode) => {
      dispatch(getProductByBarcode(barcode));
    },
    showMessage: (message) => {
      dispatch(showMessage(message));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,

)(BarcodeSearchPage);
