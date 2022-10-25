import actionTypes from '.';
import {
  register as registerAPI,
  login as loginAPI
} from '../api/auth';

import {
  showMessage
} from '../actions/checkout';

export const registerStart = () => {
  return {
    type: actionTypes.registerStart
  };
};

export const registerSuccess = (body) => {
  return {
    type: actionTypes.registerSuccess,
    manufacturer: body
  };
};

export const registerFail = (error) => {
  return {
    type: actionTypes.registerFail,
    error: error
  };
};

export const register = (obj) => {
  return async (dispatch) => {
    dispatch(registerStart());
    try {
      const response = await registerAPI(obj);
      if (response.ok) {
        const manufacturer = await response.json();
        dispatch(showMessage('Registration successful'));
        dispatch(registerSuccess(manufacturer));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(registerFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(registerFail(e));
    }
  };
};

export const loginStart = () => {
  return {
    type: actionTypes.loginStart
  };
};

export const loginSuccess = (body) => {
  return {
    type: actionTypes.loginSuccess,
    body: body
  };
};

export const loginFail = (error) => {
  return {
    type: actionTypes.loginFail,
    error: error
  };
};

export const login = (obj) => {
  return async (dispatch) => {
    dispatch(loginStart());
    try {
      const response = await loginAPI(obj);
      if (response.ok) {
        const body = await response.json();
        dispatch(showMessage('Login successful'));
        dispatch(loginSuccess(body));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(loginFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(loginFail(e));
    }
  };
};

export const logout = () => {
  return {
    type: actionTypes.logout
  };
};
