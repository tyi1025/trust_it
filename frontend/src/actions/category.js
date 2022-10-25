import actionTypes from '.';
import {
  getCategories,
  getCategoryTree as getCategoryTreeAPI,
  searchCategories as searchCategoriesAPI
} from '../api/category';

import {
  showMessage
} from '../actions/checkout';

export const getCategoryListStart = () => {
  return {
    type: actionTypes.getCategoryListStart
  };
};

export const getCategoryListSuccess = (categories) => {
  return {
    type: actionTypes.getCategoryListSuccess,
    categories: categories
  };
};

export const getCategoryListFail = (error) => { 
  return {
    type: actionTypes.getCategoryListFail,
    error: error
  };
};

export const getCategoryList = () => {
  return async (dispatch) => {
    dispatch(getCategoryListStart());
    try {
      const response = await getCategories();
      if (response.ok) {
        const categories = await response.json();
        dispatch(getCategoryListSuccess(categories));
      }
      else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(getCategoryListFail(e));
      }
    } catch (e) {
      dispatch(showMessage(e.message));
      dispatch(getCategoryListFail(e));
    }
  };
};

export const searchCategoriesStart = () => {
  return {
    type: actionTypes.searchCategoriesStart
  };
};

export const searchCategoriesSuccess = (categoryList) => {
  return {
    type: actionTypes.searchCategoriesSuccess,
    categoryList: categoryList
  };
};

export const searchCategoriesFail = (error) => {
  return {
    type: actionTypes.searchCategoriesFail,
    error: error
  };
};

export const searchCategories = (name) => {
  return async (dispatch) => {
    dispatch(searchCategoriesStart());
    try {
      const response = await searchCategoriesAPI(name);
      if(response.ok) {
        const categoryList = await response.json();
        dispatch(searchCategoriesSuccess(categoryList));
      }
      else {
        const e = await response.json();
        dispatch(searchCategoriesFail(e));
      }
    } catch(e) {
      dispatch(searchCategoriesFail(e));
    }
  };
};

export const getCategoryTreeStart = () => {
  return {
    type: actionTypes.getCategoryTreeStart
  };
};

export const getCategoryTreeSuccess = (categories) => {
  return {
    type: actionTypes.getCategoryTreeSuccess,
    categories: categories
  };
};

export const getCategoryTreeFail = (error) => {
  return {
    type: actionTypes.getCategoryTreeFail,
    error: error
  };
};

export const getCategoryTree = () => {
  return async (dispatch) => {
    dispatch(getCategoryTreeStart());
    try {
      const response = await getCategoryTreeAPI();
      if (response.ok) {
        const categories = await response.json();
        dispatch(getCategoryTreeSuccess(categories));
      }
      else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(getCategoryTreeFail(e));
      }
    } catch (e) {
      dispatch(showMessage(e.message));
      dispatch(getCategoryTreeFail(e));
    }
  };
};
