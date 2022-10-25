import actionTypes from '../actions';

const defaultState = {
  ingredientScoreLoading: false,
  ingredientListGiven: false,
  ingredientScore: [],
  ingredientScoreError: null,
  ingredientListLoading: false,
  ingredientList: [],
  ingredientListError: null,
  ingredientDetailsLoading: false,
  ingredientDetails: []
};

export default function(state=defaultState, action) {
  switch(action.type) {
  case actionTypes.getIngredientScoreStart:
    return Object.assign({}, state, {
      ingredientListGiven: false,
      ingredientScoreLoading: true,
      ingredientScore: [],
      ingredientScoreError: null
    });
  case actionTypes.getIngredientScoreSuccess:
    return Object.assign({}, state, {
      ingredientScoreLoading: false,
      ingredientScore: action.ingredientScore,
      ingredientListGiven: true,
      ingredientScoreError: null
    });
  case actionTypes.getIngredientScoreFail:
    return Object.assign({}, state, {
      ingredientScoreLoading: false,
      ingredientScore: [],
      ingredientListGiven: true,
      ingredientScoreError: action.error
    });
  case actionTypes.setIngredientListGiven:
    return Object.assign({}, state, {
      ingredientListGiven: action.given
    });
  case actionTypes.searchIngredientsStart:
    return Object.assign({}, state, {
      ingredientListLoading: true,
      ingredientList: [],
      ingredientListError: null
    });
  case actionTypes.searchIngredientsSuccess:
    return Object.assign({}, state, {
      ingredientListLoading: false,
      ingredientList: action.ingredientList,
      ingredientListError: null
    });
  case actionTypes.searchIngredientsFail:
    return Object.assign({}, state, {
      ingredientListLoading: false,
      ingredientList: [],
      ingredientListError: action.error
    });
  case actionTypes.getIngredientById:
    return Object.assign({}, state, {
      ingredientDetails: action.ingredient
    });

  case actionTypes.getIngredientDetailsStart:
    return Object.assign({}, state, {
      ingredientDetailsLoading: true,
      ingredientDetails: []
    });

  case actionTypes.getIngredientDetailsSuccess:
    return Object.assign({}, state, {
      ingredientDetailsLoading: false,
      ingredientDetails: action.ingredientDetails
    });
  case actionTypes.getIngredientDetailsFail:
    return Object.assign({}, state, {
      ingredientDetailsLoading: false,
      ingredientDetails: []
    });
  default:
    return state;
  }
}
