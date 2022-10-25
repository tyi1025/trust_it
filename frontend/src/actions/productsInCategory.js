import actionTypes from '.';
import { getProductsInCategory } from '../api/productsInCategory';

import {
  showMessage
} from '../actions/checkout';

export const getProductsInCategoryStart = () => {
  return {
    type: actionTypes.getProductsInCategoryStart
  };
};

export const getProductsInCategorySuccess = (productsIncategoryList) => {
  return {
    type: actionTypes.getProductsInCategorySuccess,
    productsIncategoryList: productsIncategoryList
  };
};

export const getProductsInCategoryFail = (error) => { 
  return {
    type: actionTypes.getProductsInCategoryFail,
    error: error
  };
};

export const getProductsInCategoryList = () => {
  return async (dispatch) => {
    dispatch(getProductsInCategoryStart());
    try {
      const response = await getProductsInCategory();
      if(response.ok) {
        const productsIncategoryList = await response.json();
        dispatch(getProductsInCategorySuccess(productsIncategoryList));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(getProductsInCategoryFail(e));
      }
    } catch (e) {
      dispatch(showMessage(e.message));
      dispatch(getProductsInCategoryFail(e));
    }
  };
};