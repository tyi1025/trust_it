import actionTypes from '.';
import {
  getManufacturers
} from '../api/example';

export const selectManufacturer = ({ manufacturerId }) => {
  return {
    type: actionTypes.selectManufacturer,
    manufacturerId: manufacturerId
  };
};

export const getManufacturerListStart = () => {
  return {
    type: actionTypes.getManufacturerListStart
  };
};

export const getManufacturerListSuccess = (manufacturers) => {
  return {
    type: actionTypes.getManufacturerListSuccess,
    manufacturerList: manufacturers
  };
};

export const getManufacturerListFail = (error) => {
  return {
    type: actionTypes.getManufacturerListFail,
    error: error
  };
};

export const getManufacturerList = () => {
  return async (dispatch) => {
    dispatch(getManufacturerListStart());
    try {
      const response = await getManufacturers();
      const manufacturers = await response.json();
      dispatch(getManufacturerListSuccess(manufacturers));
    } catch(e) {
      dispatch(getManufacturerListFail(e));
    }
  };
};
