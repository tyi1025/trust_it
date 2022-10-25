import { store } from '../store';
import queryString from 'query-string';

export const getProducts = async (obj) => {
  if(obj) {
    return await fetch(
      process.env.REACT_APP_API_URL + `products?${queryString.stringify(obj)}`);
  } else
    return await fetch(process.env.REACT_APP_API_URL + 'products');
};

export const getProductsManufacturer = async (obj) => {
  return await fetch(process.env.REACT_APP_API_URL + `products?${queryString.stringify(obj)}`);
};


export const addNewProduct = async (obj) => {
  const state = store.getState();
  return await fetch(
    process.env.REACT_APP_API_URL + 'auth/products',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + state.auth.jwtToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });
};

export const getProductDetails = async ({productId}) => {
  return await fetch(process.env.REACT_APP_API_URL + 'products/' + productId);
};

export const getProductByBarcode = async (barcode) => {
  return await fetch(process.env.REACT_APP_API_URL + `products?barcode=${barcode}`);
};

export const updateProductDetails = async (obj) => {
  const state = store.getState();
  return await fetch(process.env.REACT_APP_API_URL + `auth/products/${obj.productId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + state.auth.jwtToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });
};
export const getProductById = async (id) => {
  return await fetch(process.env.REACT_APP_API_URL + `products/${id}`);
};

export const uploadProductImage = async (file) => {
  return await fetch(process.env.REACT_APP_API_URL + 'upload',
    {
      method: 'POST',
      body: file,
    });
};

export const getProductImageById = async (fileId) => {
  return await fetch(process.env.REACT_APP_API_URL + `fetch/${fileId}`);
};

export const applyCertificate = async (productIds) => {
  const state = store.getState();
  return await fetch(
    process.env.REACT_APP_API_URL + 'auth/apply_certificate',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + state.auth.jwtToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productIds)
    });
};
