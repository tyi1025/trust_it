import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import ManufacturerHeader from '../connectedComponents/ManufacturerHeader';
import Autocomplete from '../components/AutoComplete';
import {
  updateProductById, getProductById, addProductDetails,
  saveUploadedProductImage, applyCertificate, clearProductDetails
} from '../actions/product';
import { searchIngredients } from '../actions/ingredient';
import { searchCategories } from '../actions/category';
import '../scss/EditProduct.scss';
import Loading from '../components/Loading';
import RedirectingLoading from '../components/RedirectingLoading';

const EditProductPage = function(props) {
  const { productId } = useParams();
  const { jwtToken } = props;

  const navigate = useNavigate();
  const location = useLocation();

  if (!jwtToken) {
    setTimeout(() => {
      navigate('/portal/login');
    }, 5000);
    return (
      <div>
        <RedirectingLoading />
      </div>
    );
  }

  const {
    product, getProductById, productDetailsLoading, manufacturer,
    addProductDetails, uploadImageLoading, uploadedImageId, updateProductById,
    isEditingProduct, saveUploadedProductImage, addProductDetailsError,
    clearProductDetails,

    applyCertificate, applyCertificateLoading,

    ingredientList, searchIngredients,
    categories, searchCategories
  } = props;

  const updatedName = useRef('');
  const updatedDescription = useRef('');
  const updatedLink = useRef('');
  const updatedBarcode = useRef('');

  const delayedSearchIngredients = useRef(_.debounce((value) => {
    searchIngredients(value);
  }, 1000)).current;
  const delayedSearchCategories = useRef(_.debounce((value) => {
    searchCategories(value);
  }, 1000)).current;

  const [updatedIngredientList, setIngredientList] = useState([]);
  const [updatedImageList, setImageList] = useState([]);
  const [updatedCategory, setCategory] =
    useState(product && product.category ? product.category : {});
  // Ugly hack for Autocomplete, pretend you can't see this
  const [removingIngredient, setRemovingIngredient] = useState(false);
  const [submitButtonPressed, setSubmitButtonPressed] = useState(false);

  const addIngredient = ()=>{
    setIngredientList([...updatedIngredientList, {
      _id: '',
      name: ''
    }]);
  };

  const removeIngredient = (index)=>{
    setRemovingIngredient(true);
    // Nice
    setTimeout(() => setRemovingIngredient(false), 0);
    setIngredientList(updatedIngredientList.filter((_, index2) => {
      return index !== index2;
    }));
  };

  const removeImage = (index) => {
    setImageList(updatedImageList.filter((_, index2) => {
      return index !== index2;
    }));
  };

  useEffect(() => {
    clearProductDetails();
    setTimeout(() => {
      updatedName.current.value = '';
      updatedDescription.current.value = '';
      updatedLink.current.value = '';
      updatedBarcode.current.value = '';
      setIngredientList([]);
      setImageList([]);
      setCategory({});
    }, 0);
    if (productId) {
      getProductById(productId);
    }
  }, []);

  useEffect(() => {
    product && product.length !== 0 && (updatedName.current.value = product.name);
    product && product.length !== 0 && (updatedDescription.current.value = product.description);
    product && product.length !== 0 && (updatedLink.current.value = product.affiliateLink);
    product && product.length !== 0 && (updatedBarcode.current.value = product.barcode);
    product.ingredients && setIngredientList(product.ingredients);
    product.images && setImageList(product.images.map((image) => {
      return {
        type: 'remote',
        image: image
      };
    }));
    product.category && setCategory(product.category);
  }, [product]);

  useEffect(() => {
    if (uploadedImageId) {
      const rows = [...updatedImageList];
      rows.pop();
      rows.push({ type: 'remote', image: uploadedImageId });
      setImageList(rows);
    }
  }, [uploadedImageId]);

  useEffect(() => {
    if (submitButtonPressed && !isEditingProduct && !addProductDetailsError) {
      if (location.pathname === '/portal/new_product') {
        navigate('/portal/edit_product/' + product._id);
      } 
    }
  }, [submitButtonPressed, isEditingProduct]);

  function renderCertificationStatus() {
    const disabled = applyCertificateLoading ||
      manufacturer.certificateQuota <= 0 ||
      product.certificationStatus !== 'none';

    let status = 'Inactive';
    if (product.certificationStatus === 'pending') {
      status = 'Pending';
    } else if (product.certificationStatus === 'certified') {
      status = 'Certified';
    }

    return (
      <Form.Group className="form-row">
        <Form.Label>Certification Status</Form.Label>
        <div className="form-control certification-status">
          <div className="status">
            {status}
          </div>
          <Button
            variant={disabled ? 'secondary' : 'primary'}
            disabled={disabled}
            onClick={() => applyCertificate([product._id])}>
            Apply for Certificate
          </Button>
        </div>
      </Form.Group>
    );
  }

  function renderIngredient(data, index) {
    return (
      <Form.Group
        className="ingredient" key={'edit_product_ingredient_' + index }>
        <Autocomplete
          suggestions={ingredientList}
          defaultValue={data.name}
          onChange={(value)=>{
            delayedSearchIngredients(value);
          }}
          onClick={(value) => {
            setIngredientList(updatedIngredientList.map((item, index2) => {
              if (index === index2) {
                return value;
              }
              return item;
            }));
          }} />
        <Button
          className="delete-btn"
          variant="danger"
          onClick={() => removeIngredient(index)}>
          x
        </Button>
      </Form.Group>
    );
  }

  function renderImage(image, index) {
    let elm = null;
    if (image.type === 'remote') {
      elm = <img src={process.env.REACT_APP_API_URL + 'fetch/' + image.image} />;
    } else if (image.type === 'local') {
      elm = (
        <React.Fragment>
          <img src={URL.createObjectURL(image.image)} />
          <div className="loading">Loading</div>
        </React.Fragment>
      );
    }

    return (
      <div
        key={'edit_product_image_' + index} className="image">
        {elm}
        <div className="delete-btn" onClick={() => removeImage(index)}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </div>
      </div>
    );
  }

  if (product) {
    return (
      <React.Fragment>
        <ManufacturerHeader />
        <Form className="edit-product-form">
          <Form.Group className="form-row">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              ref={updatedName}
              placeholder="Name of the Product"
              defaultValue={product.name} />
          </Form.Group>
          {productId && renderCertificationStatus()}
          <Form.Group className="form-row">
            <Form.Label>Manufacturer Name</Form.Label>
            <Form.Control
              type="text"
              defaultValue={manufacturer.name}
              placeholder="Manufacturer name"
              readOnly={true} />
          </Form.Group>
          <Form.Group className="form-row">
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              as="textarea"
              ref={updatedDescription}
              defaultValue={product.description}
              placeholder="Product Description" />
          </Form.Group>
          <Form.Group className="form-row category">
            <Form.Label>Category Name</Form.Label>
            <Autocomplete
              placeholder="Product Category"
              defaultValue={product.category?.name}
              suggestions={categories}
              onChange={(value) => {
                delayedSearchCategories(value);
              }}
              onClick={(value) => {
                setCategory(value);
              }} />
          </Form.Group>
          <Form.Group className="form-row">
            <Form.Label>Affiliate Link</Form.Label>
            <Form.Control
              type="text"
              ref={updatedLink}
              defaultValue={product.description}
              placeholder="Product Link" />
          </Form.Group>
          <Form.Group className="form-row">
            <Form.Label>Barcode</Form.Label>
            <Form.Control
              type="text"
              ref={updatedBarcode}
              defaultValue={product.description}
              placeholder="Barcode Number" />
          </Form.Group>
          <Form.Group className="form-row image-list">
            <Form.Label>Product Image</Form.Label>
            <div className="images-container">
              {updatedImageList?.map(renderImage)}
              <div className="image">
                <label
                  htmlFor={uploadImageLoading ? '' : 'file_upload'}
                  className={
                    uploadImageLoading ? 'new-image disabled' : 'new-image'}>
                  <FontAwesomeIcon icon={faCirclePlus} size="lg" />
                  Add Image
                </label>
              </div>
            </div>
            <Form.Control
              type="file" id="file_upload" className="upload"
              onChange={(event) => {
                saveUploadedProductImage(event.target.files[0]);
                setImageList([
                  ...updatedImageList,
                  { type: 'local', image: event.target.files[0] }
                ]);
              }} />
          </Form.Group>
          <Form.Group className="form-row ingredient-list">
            <Form.Label>Ingredient List</Form.Label>
            {!removingIngredient && updatedIngredientList.map(renderIngredient)}
            <Button
              className="add-new"
              onClick={addIngredient}>Add New</Button>
          </Form.Group>
          <Form.Group className="form-row">
            <Button
              variant={uploadImageLoading ? 'secondary' : 'primary'}
              disabled={uploadImageLoading}
              onClick={() => {
                const images = updatedImageList
                  .filter(item => item.type === 'remote')
                  .map(item => item.image);

                if (productId) {
                  updateProductById({
                    productId: productId,
                    name: updatedName.current.value,
                    description: updatedDescription.current.value,
                    category: updatedCategory._id,
                    affiliateLink: updatedLink.current.value,
                    barcode: updatedBarcode.current.value,
                    ingredients: updatedIngredientList.map(item => item._id),
                    images: images
                  });
                } else {
                  addProductDetails({
                    name: updatedName.current.value,
                    manufacturer: manufacturer.username,
                    description: updatedDescription.current.value,
                    category: updatedCategory._id,
                    affiliateLink: updatedLink.current.value,
                    barcode: updatedBarcode.current.value,
                    ingredients: updatedIngredientList.map(item => item._id),
                    images: images
                  });
                }
                setSubmitButtonPressed(true);
              }}>Submit</Button>
          </Form.Group>
        </Form>
        {productDetailsLoading && <Loading />}
      </React.Fragment>
    );
  }
};

const mapStateToProps = function(state) {
  return {
    productDetailsLoading: state.product.productDetailsLoading,
    product: state.product.productDetails,
    isEditingProduct: state.product.isEditingProduct,
    jwtToken: state.auth.jwtToken,
    loading: state.auth.loginLoading,
    manufacturer: state.auth.loggedInManufacturer,
    uploadImageLoading: state.product.uploadImageLoading,
    uploadedImageId: state.product.uploadedImageId,

    addProductDetailsError: state.product.addProductDetailsError,

    applyCertificateLoading: state.product.applyCertificateLoading,
    applyCertificateError: state.product.applyCertificateError,

    ingredientList: state.ingredient.ingredientList,
    ingredientListLoading: state.ingredient.ingredientListLoading,

    categories: state.category.categories,
    categoriesLoading: state.category.categoriesLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProductById: (productId) => {
      dispatch(getProductById({productId}));
    },
    saveUploadedProductImage: (file) => {
      dispatch(saveUploadedProductImage(file));
    },
    updateProductById: (updatedProduct) => {
      dispatch(updateProductById(updatedProduct));
    },
    addProductDetails: (newProduct) => {
      dispatch(addProductDetails(newProduct));
    },
    clearProductDetails: () => {
      dispatch(clearProductDetails());
    },
    applyCertificate: (productId) => {
      dispatch(applyCertificate(productId));
    },
    searchIngredients: (value) => {
      dispatch(searchIngredients(value));
    },
    searchCategories: (value) => {
      dispatch(searchCategories(value));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProductPage);