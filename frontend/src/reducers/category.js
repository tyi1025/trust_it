import actionTypes from '../actions';

const defaultState = {
  categoriesLoading: false,
  categories: [],
  categoriesError: null,
  categoryTreeLoading: false,
  categoryTree: [],
  categoryTreeError: null
};

export default function(state=defaultState, action) {
  switch(action.type) {
  case actionTypes.getCategoryListStart:
    return Object.assign({}, state, {
      categoriesLoading: true,
      categories: []
    });
  case actionTypes.getCategoryListSuccess:
    return Object.assign({}, state, {
      categoriesLoading: false,
      categories: action.categories
    });
  case actionTypes.getCategoryListFail:
    return Object.assign({}, state, {
      categoriesLoading: false,
      categories: []
    });
  case actionTypes.searchCategoriesStart:
    return Object.assign({}, state, {
      categoriesLoading: true,
      categories: [],
      categoriesError: null
    });
  case actionTypes.searchCategoriesSuccess:
    return Object.assign({}, state, {
      categoriesLoading: false,
      categories: action.categoryList,
      categoriesError: null
    });
  case actionTypes.searchCategoriesFail:
    return Object.assign({}, state, {
      categoriesLoading: false,
      categories: [],
      categoriesError: action.error
    });
  case actionTypes.getCategoryTreeStart:
    return Object.assign({}, state, {
      categoryTreeLoading: true,
      categoryTree: [],
      categoryTreeError: null
    });
  case actionTypes.getCategoryTreeSuccess:
    return Object.assign({}, state, {
      categoryTreeLoading: false,
      categoryTree: action.categories,
      categoryTreeError: null
    });
  case actionTypes.getCategoryTreeFail:
    return Object.assign({}, state, {
      categoryTreeLoading: false,
      categoryTree: [],
      categoryTreeError: action.error
    });
  default:
    return state;
  }
}
