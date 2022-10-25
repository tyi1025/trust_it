import actionTypes from '.';
import {
  getIngredientScore,
  getIngredientById as getIngredientByIdAPI,
  searchIngredients as searchIngredientsAPI
} from '../api/ingredient';

import {
  showMessage
} from '../actions/checkout';

export const getIngredientScoreStart = () => {
  return {
    type: actionTypes.getIngredientScoreStart
  };
};

export const getIngredientScoreSuccess = (score) => {
  return {
    type: actionTypes.getIngredientScoreSuccess,
    ingredientScore: score
  };
};

export const getIngredientScoreFail = (error) => {
  return {
    type: actionTypes.getIngredientScoreFail,
    error: error
  };
};

export const setIngredientListGiven = (given) => {
  return {
    type: actionTypes.setIngredientListGiven,
    given: given
  };
};

export const getIngredientListScore = (ingredientList) => {
  return async (dispatch) => {
    try {
      if(ingredientList !== '') {
        dispatch(getIngredientScoreStart());
        const list = ingredientList.split('\n');
        const response = await getIngredientScore(list);
        if(response.ok) {
          const ingredientDetails = await response.json();
          dispatch(getIngredientScoreSuccess(ingredientDetails));
        } else {
          const e = await response.json();
          dispatch(showMessage(e.message));
          dispatch(getIngredientScoreFail(e));
        }
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(getIngredientScoreFail(e));
    }
  };
};

export const searchIngredientsStart = () => {
  return {
    type: actionTypes.searchIngredientsStart
  };
};

export const searchIngredientsSuccess = (ingredientList) => {
  return {
    type: actionTypes.searchIngredientsSuccess,
    ingredientList: ingredientList
  };
};

export const searchIngredientsFail = (error) => {
  return {
    type: actionTypes.searchIngredientsFail,
    error: error
  };
};

export const searchIngredients = (name) => {
  return async (dispatch) => {
    dispatch(searchIngredientsStart());
    try {
      const response = await searchIngredientsAPI(name);
      if(response.ok) {
        const ingredientList = await response.json();
        dispatch(searchIngredientsSuccess(ingredientList));
      }
      else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(searchIngredientsFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(searchIngredientsFail(e));
    }
  };
};

export const getIngredientDetailsStart = () => {
  return {
    type: actionTypes.getIngredientDetailsStart
  };
};

export const getIngredientDetailsSuccess = (ingredient) => {
  return {
    type: actionTypes.getIngredientDetailsSuccess,
    ingredientDetails: ingredient
  };
};

export const getIngredientDetailsFail = (error) => {
  return {
    type: actionTypes.getIngredientDetailsFail,
    error: error
  };
};

export const getIngredientById = (ingredientId) => {
  return async (dispatch) => {
    dispatch(getIngredientDetailsStart());
    try {
      const response = await getIngredientByIdAPI(ingredientId);
      if(response.ok) {
        const ingredient = await response.json();
        dispatch(getIngredientDetailsSuccess(ingredient));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(getIngredientDetailsFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(getIngredientDetailsFail(e));
    }
  };
};
