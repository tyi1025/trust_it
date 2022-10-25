import actionTypes from '../actions';

const defaultState = {
  productsIncategoryListLoading: false,
  productsIncategoryList: [],

};

export default function(state=defaultState, action) {
  switch(action.type) {
  case actionTypes.getProductsInCategoryStart:
    return Object.assign({}, state, {
      productsIncategoryListLoading: true,
      productsIncategoryList: []
    });
  case actionTypes.getProductsInCategorySuccess:
    return Object.assign({}, state, {
      productsIncategoryListLoading: false,
      productsIncategoryList: action.productsIncategoryList
    });
  case actionTypes.getProductsInCategoryFail:
    return Object.assign({}, state, {
      productsIncategoryListLoading: false,
      productsIncategoryList: []
    });
  default:
    return state;
  }
}
