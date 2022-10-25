import actionTypes from '.';
import { 
  getProducts,
  getProductByBarcode as getProductByBarcodeAPI,
  getProductById as getProductByIdAPI,
  updateProductDetails,
  uploadProductImage,
  getProductImageById,
  addNewProduct,
  getProductsManufacturer as getProductsManufacturerAPI,
  applyCertificate as applyCertificateAPI
} from '../api/product';

import {
  showMessage
} from '../actions/checkout';

export const getProductDetailsStart = () => {
  return {
    type: actionTypes.getProductDetailsStart
  };
};

export const getProductDetailsSuccess = (product) => {
  return {
    type: actionTypes.getProductDetailsSuccess,
    productDetails: product
  };
};

export const getProductDetailsFail = (error) => {
  return {
    type: actionTypes.getProductDetailsFail,
    error: error
  };
};

export const getProductById = ({productId}) => {
  return async (dispatch) => {
    dispatch(getProductDetailsStart());
    try {
      const response = await getProductByIdAPI(productId);
      if(response.ok) {
        const product = await response.json();
        dispatch(getProductDetailsSuccess(product));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(getProductDetailsFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(getProductDetailsFail(e));
    }
  };
};

export const updateProductDetailsStart = () => {
  return {
    type: actionTypes.updateProductDetailsStart
  };
};

export const updateProductDetailsSuccess = (product) => {
  return {
    type: actionTypes.updateProductDetailsSuccess,
    productDetails: product
  };
};

export const updateProductDetailsFail = (error) => {
  return {
    type: actionTypes.updateProductDetailsFail,
    error: error
  };
};

export const updateProductById = (obj) => {
  return async (dispatch) => {
    dispatch(updateProductDetailsStart());
    try {
      const response = await updateProductDetails(obj);
      if(response.ok) {
        const product = await response.json();
        dispatch(updateProductDetailsSuccess(product));
        dispatch(showMessage('Product Updated'));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(updateProductDetailsFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(updateProductDetailsFail(e));
    }
  };
};

export const getProductListStart = () => {
  return {
    type: actionTypes.getProductListStart
  };
};

export const getProductListSuccess = (product) => {
  return {
    type: actionTypes.getProductListSuccess,
    productDetails: product
  };
};

export const getProductListFail = (error) => {
  return {
    type: actionTypes.getProductListFail,
    error: error
  };
};

export const getProductList = (obj) => {
  return async (dispatch) => {
    dispatch(getProductListStart());
    try {
      const response = await getProducts(obj);
      if(response.ok) {
        const products = await response.json();
        dispatch(getProductListSuccess(products));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(getProductListFail(e));
      }
    } catch (e) {
      dispatch(showMessage(e.message));
      dispatch(getProductListFail(e));
    }
  };
};

export const getProductsManufacturerStart = () => {
  return {
    type: actionTypes.getProductsManufacturerStart
  };
};

export const getProductsManufacturerSuccess = (product) => {
  return {
    type: actionTypes.getProductsManufacturerSuccess,
    productDetails: product
  };
};

export const getProductsManufacturerFail = (error) => {
  return {
    type: actionTypes.getProductsManufacturerFail,
    error: error
  };
};

export const getProductsManufacturer = (manufacturer) => {
  return async (dispatch) => {
    dispatch(getProductsManufacturerStart());
    try {
      const response = await getProductsManufacturerAPI(manufacturer);
      if(response.ok) {
        const products = await response.json();
        dispatch(getProductsManufacturerSuccess(products));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(getProductsManufacturerFail(e));
      }
    } catch (e) {
      dispatch(showMessage(e.message));
      dispatch(getProductsManufacturerFail(e));
    }
  };
};

export const updateBarcode = ({barcode}) => {
  return {
    type: actionTypes.updateBarcode,
    barcode: barcode
  };
};

export const getProductByBarcodeStart = () => {
  return {
    type: actionTypes.getProductByBarcodeStart
  };
};

export const getProductByBarcodeSuccess = (product) => {
  return {
    type: actionTypes.getProductByBarcodeSuccess,
    product: product
  };
};

export const getProductByBarcodeFail = (error) => {
  return {
    type: actionTypes.getProductByBarcodeFail,
    error: error
  };
};

export const getProductByBarcode = (barcode) => {
  return async (dispatch) => {
    dispatch(getProductByBarcodeStart());
    try {
      const response = await getProductByBarcodeAPI(barcode);
      if(response.ok) {
        const products = await response.json();
        const product = products[0];
        
        dispatch(getProductByBarcodeSuccess(product));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(getProductByBarcodeFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(getProductByBarcodeFail(e));
    }
  };
};

export const saveUploadedProductImageStart = () => {
  return {
    type: actionTypes.saveUploadedProductImageStart
  };
};

export const saveUploadedProductImageSuccess = (image_id) => {
  return {
    type: actionTypes.saveUploadedProductImageSuccess,
    image_id: image_id
  };
};

export const saveUploadedProductImageFail = (error) => {
  return {
    type: actionTypes.saveUploadedProductImageFail,
    error: error
  };
};

export const saveUploadedProductImage = (imageFile) => {
  return async (dispatch) => {
    dispatch(saveUploadedProductImageStart());
    try {
      let data = new FormData();
      data.append('file', imageFile);
      const response = await uploadProductImage(data);
      if(response.ok) {
        const {image_id} = await response.json();
        dispatch(saveUploadedProductImageSuccess(image_id));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(saveUploadedProductImageFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(saveUploadedProductImageFail(e));
    }
  };
};

export const getProductImageStart = () => {
  return {
    type: actionTypes.getProductImageStart
  };
};

export const getProductImageSuccess = (image) => {
  return {
    type: actionTypes.getProductImageSuccess,
    image: image
  };
};

export const getProductImageFail = (error) => {
  return {
    type: actionTypes.getProductImageFail,
    error: error
  };
};

export const getProductImage = (fileId) => {
  return async (dispatch) => {
    dispatch(getProductImageStart());
    try {
      const response = await getProductImageById(fileId);
      if(response.ok) {
        const image = await response.blob();
        dispatch(getProductImageSuccess(URL.createObjectURL(image)));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(getProductImageFail(e));
      }
    } catch (e) {
      dispatch(showMessage(e.message));
      dispatch(getProductImageFail(e));
    }
  };
};


export const addProductDetailsStart = () => {
  return {
    type: actionTypes.addProductDetailsStart
  };
};

export const addProductDetailsSuccess = (product) => {
  return {
    type: actionTypes.addProductDetailsSuccess,
    productDetails: product
  };
};

export const addProductDetailsFail = (error) => {
  return {
    type: actionTypes.addProductDetailsFail,
    error: error
  };
};

export const addProductDetails = (product) => {
  return async (dispatch) => {
    dispatch(addProductDetailsStart());
    try {
      const response = await addNewProduct(product);
      if (response.ok) {
        const newProduct = await response.json();
        dispatch(showMessage('Product Added'));
        dispatch(addProductDetailsSuccess(newProduct));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(addProductDetailsFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(addProductDetailsFail(e));
    }
  };
};

export const addProductToComp = (product) => {
  return {
    type: actionTypes.addProductToComp,
    product: product
  };
};

export const removeProductFromComp = (product) => {
  return {
    type: actionTypes.removeProductFromComp,
    product: product
  };
};

export const applyCertificateStart = () => {
  return {
    type: actionTypes.applyCertificateStart
  };
};

export const applyCertificateSuccess = (body) => {
  return {
    type: actionTypes.applyCertificateSuccess,
    body: body
  };
};

export const applyCertificateFail = (error) => {
  return {
    type: actionTypes.applyCertificateFail,
    error: error
  };
};

export const applyCertificate = (productIds) => {
  return async (dispatch) => {
    dispatch(applyCertificateStart());
    try {
      const response = await applyCertificateAPI(productIds);
      if(response.ok) {
        const body = await response.json();
        dispatch(showMessage('Application submitted!'));
        dispatch(applyCertificateSuccess(body));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(applyCertificateFail(e));
      }
    } catch (e) {
      dispatch(showMessage(e.message));
      dispatch(applyCertificateFail(e));
    }
  };
};

export const clearProductDetails = () => {
  return {
    type: actionTypes.clearProductDetails
  };
};
