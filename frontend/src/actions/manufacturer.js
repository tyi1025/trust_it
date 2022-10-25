import actionTypes from '.';
import {
  getManufacturerSelf as getManufacturerSelfAPI
} from '../api/manufacturer';

import {
  showMessage
} from '../actions/checkout';

export const getManufacturerSelfStart = () => {
  return {
    type: actionTypes.getManufacturerSelfStart
  };
};

export const getManufacturerSelfSuccess = (manufacturer) => {
  return {
    type: actionTypes.getManufacturerSelfSuccess,
    manufacturer: manufacturer
  };
};

export const getManufacturerSelfFail = (error) => {
  return {
    type: actionTypes.getManufacturerSelfFail,
    error: error
  };
};

export const getManufacturerSelf = () => {
  return async (dispatch) => {
    dispatch(getManufacturerSelfStart());
    try {
      const response = await getManufacturerSelfAPI();
      if(response.ok) {
        const manufacturer = await response.json();
        dispatch(getManufacturerSelfSuccess(manufacturer));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(getManufacturerSelfFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(getManufacturerSelfFail(e));
    }
  };
};
