import actionTypes from '../actions';

const defaultState = {
  productDetailsLoading: false,
  productDetails: [],
  isEditingProduct: false,
  productListLoading: false,
  productListDetails: [],
  productImageLoading: [],
  productImage: [],
  barcode: '',
  productCompList: [],
  uploadImageLoading: false,
  uploadedImageId: '',
  uploadImageError: '',
  addProductDetailsError: null,
  applyCertificateLoading: false,
  applyCertificateError: null,
  getProductByBarcodeLoading: false,
  getProductByBarcodeError: null,
};

export default function(state=defaultState, action) {
  switch(action.type) {
  case actionTypes.updateBarcode:
    return Object.assign({}, state, {
      barcode: action.barcode
    });
  case actionTypes.getProductByBarcodeSuccess:
    return Object.assign({}, state, {
      productDetails: action.product,
      getProductByBarcodeLoading: false,
      getProductByBarcodeError: null,
    });
  case actionTypes.getProductByBarcodeFail:
    return Object.assign({}, state, {
      productDetails: [],
      getProductByBarcodeLoading: false,
      getProductByBarcodeError: action.error,
    });
  case actionTypes.getProductByBarcodeStart:
    return Object.assign({}, state, {
      getProductByBarcodeLoading: true,
      getProductByBarcodeError: null,
    });
  
  case actionTypes.getProductById:
    return Object.assign({}, state, {
      productDetails: action.product
    });

  case actionTypes.getProductDetailsStart:
    return Object.assign({}, state, {
      productDetailsLoading: true,
      productDetails: []
    });
  case actionTypes.getProductDetailsSuccess:
    return Object.assign({}, state, {
      productDetailsLoading: false,
      productDetails: action.productDetails
    });
  case actionTypes.getProductDetailsFail:
    return Object.assign({}, state, {
      productDetailsLoading: false,
      productDetails: []
    });
  case actionTypes.updateProductDetailsStart:
    return Object.assign({}, state, {
      isEditingProduct: true,
      productDetailsLoading: true,
      productDetails: []
    });
  case actionTypes.updateProductDetailsSuccess:
    return Object.assign({}, state, {
      productDetailsLoading: false,
      productDetails: action.productDetails,
      isEditingProduct: false,
    });
  case actionTypes.updateProductDetailsFail:
    return Object.assign({}, state, {
      productDetailsLoading: false,
      productDetails: [],
      isEditingProduct: false,
    });
  case actionTypes.addProductDetailsStart:
    return Object.assign({}, state, {
      isEditingProduct: true,
      productDetailsLoading: true,
      productDetails: [],
      addProductDetailsError: null
    });
  case actionTypes.addProductDetailsSuccess:
    return Object.assign({}, state, {
      productDetailsLoading: false,
      productDetails: action.productDetails,
      isEditingProduct: false,
      addProductDetailsError: null
    });
  case actionTypes.addProductDetailsFail:
    return Object.assign({}, state, {
      productDetailsLoading: false,
      productDetails: [],
      isEditingProduct: false,
      addProductDetailsError: action.error
    });
  case actionTypes.getProductListStart:
    return Object.assign({}, state, {
      productListLoading: true,
      productListDetails: []
    });
  case actionTypes.getProductListSuccess:
    return Object.assign({}, state, {
      productListLoading: false,
      productListDetails: action.productDetails
    });
  case actionTypes.getProductListFail:
    return Object.assign({}, state, {
      productListLoading: false,
      productListDetails: []
    });
  case actionTypes.getProductsManufacturerStart:
    return Object.assign({}, state, {
      productListLoading: true,
      productListDetails: []
    });
  case actionTypes.getProductsManufacturerSuccess:
    return Object.assign({}, state, {
      productListLoading: false,
      productListDetails: action.productDetails
    });
  case actionTypes.getProductsManufacturerFail:
    return Object.assign({}, state, {
      productListLoading: false,
      productListDetails: []
    });
  case actionTypes.saveUploadedProductImageStart:
    return Object.assign({}, state, {
      uploadImageLoading: true,
      uploadedImageId: '',
      uploadImageError: false
    });
  case actionTypes.saveUploadedProductImageSuccess:
    return Object.assign({}, state, {
      uploadImageLoading: false,
      uploadedImageId: action.image_id,
      uploadImageError: false
    });
  case actionTypes.saveUploadedProductImageFail:
    return Object.assign({}, state, {
      uploadImageLoading: false,
      uploadedImageId: '',
      uploadImageError: action.error
    });
  case actionTypes.getProductImage:
    return Object.assign({}, state, {
      productImage: []
    });
  case actionTypes.getProductImageStart:
    return Object.assign({}, state, {
      productImageLoading: true,
      productImage: []
    });
  case actionTypes.getProductImageSuccess:
    return Object.assign({}, state, {
      productImageLoading: false,
      productImage: action.image
    });
  case actionTypes.getProductImageFail:
    return Object.assign({}, state, {
      productImageLoading: false,
      productImage: []
    });

  case actionTypes.addProductToComp:
    if (state.productCompList.length >= 4) {
      return Object.assign({}, state);
    }
    return Object.assign({}, state, {
      ...state,
      productCompList: state.productCompList.map((prod) => {
        if (prod._id !== action.product._id) {
          return prod;
        }
        return false;
      }).filter((prod) => {
        return prod;
      }).concat(action.product)
    });
  case actionTypes.removeProductFromComp:
    return Object.assign({}, state, {
      ...state,
      productCompList: state.productCompList.filter(item => item._id !== action.product._id)
    });
  case actionTypes.applyCertificateStart:
    return Object.assign({}, state, {
      applyCertificateLoading: true,
      applyCertificateError: null
    });
  case actionTypes.applyCertificateSuccess:
    return Object.assign({}, state, {
      applyCertificateLoading: false,
      productDetails: action.body.products[0],
      applyCertificateError: null
    });
  case actionTypes.applyCertificateFail:
    return Object.assign({}, state, {
      applyCertificateLoading: false,
      applyCertificateError: action.error
    });
  case actionTypes.clearProductDetails:
    return Object.assign({}, state, {
      productDetails: []
    });
  default:
    return state;
  }
}
