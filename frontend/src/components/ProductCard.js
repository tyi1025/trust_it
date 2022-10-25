import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';

import ProductImage from './ProductImage';

import '../scss/ProductCard.scss';
const ProductCard = (props) => {
  const {
    edit=false, allowApplyCertificate=false,
    addToCertificateApplication=()=>{}, removeFromCertificateApplication=()=>{}
  } = props;
  const {
    name, images, overallScore, certificationStatus
  } = props.product;

  const route = edit ? '/portal/edit_product/' : '/product/';

  function renderApplyCertificateCheckbox() {
    return (
      <Form.Check
        id={'apply-check-box' + props.product._id}
        className="apply-certificate-checkbox"
        type="checkbox"
        label="Apply Certificate!"
        onChange={(e) => {
          e.target.checked ? addToCertificateApplication(props.product._id) :
            removeFromCertificateApplication(props.product._id);
        }}
        disabled={certificationStatus !== 'none'} />
    );
  }

  function renderScore(score, ingredients) {
    if (!(ingredients.length >= 1)) {
      return (
        <div className={'score none'}>-</div>
      );   
    }

    let scoreClass = 'low';

    if (score > 3) {
      scoreClass = 'medium';
    }

    if (score > 8) {
      scoreClass = 'high';
    }

    return (
      <div className={'score ' + scoreClass}>{overallScore}</div>
    );
  }

  return (
    <div className='product-card'>
      <Link to={route + props.product._id}>
        <ProductImage fileId={images && images[0]} />
      </Link>
      <Link to={route + props.product._id}>
        <div className="name">{name}</div>
      </Link>
      {
        certificationStatus === 'certified' &&
          <div className='certified-container'>
            <FontAwesomeIcon className="certified" icon={faCheck} />
            Certified!
          </div>
      }
      {
        props.addProductToComp &&
          <Button
            className="compare-button"
            onClick={() => props.addProductToComp(props.product)}>
            <FontAwesomeIcon className="add" icon={faPlus} />
            Add to Compare
          </Button>
      }
      {allowApplyCertificate && renderApplyCertificateCheckbox()}
      {renderScore(overallScore, props.product.ingredients)}
    </div>
  );
};

export default ProductCard;
