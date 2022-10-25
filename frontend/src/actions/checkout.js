import actionTypes from '.';
import {
  preCheckout as preCheckoutAPI,
  postCheckout as postCheckoutAPI,
  startTrial as startTrialAPI
} from '../api/checkout';

export const preCheckoutStart = () => {
  return {
    type: actionTypes.preCheckoutStart
  };
};

export const preCheckoutSuccess = (body) => {
  return {
    type: actionTypes.preCheckoutSuccess,
    paymentIntent: body
  };
};

export const preCheckoutFail = (error) => {
  return {
    type: actionTypes.preCheckoutFail,
    error: error
  };
};

export const preCheckout = (amount) => {
  return async (dispatch) => {
    dispatch(preCheckoutStart());
    try {
      const response = await preCheckoutAPI({amount});
      if (response.ok) {
        const paymentIntent = await response.json();
        dispatch(preCheckoutSuccess(paymentIntent));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(preCheckoutFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(preCheckoutFail(e));
    }
  };
};

export const postCheckoutStart = () => {
  return {
    type: actionTypes.postCheckoutStart
  };
};

export const postCheckoutSuccess = (body) => {
  return {
    type: actionTypes.postCheckoutSuccess,
    body: body
  };
};

export const postCheckoutFail = (error) => {
  return {
    type: actionTypes.postCheckoutFail,
    error: error
  };
};

export const postCheckout = (paymentIntent, amount) => {
  return async (dispatch) => {
    dispatch(postCheckoutStart());
    try {
      const response = await postCheckoutAPI({paymentIntent, amount});
      if (response.ok) {
        const body = await response.json();
        dispatch(postCheckoutSuccess(body));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(postCheckoutFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(postCheckoutFail(e));
    }
  };
};

export const startTrialStart = () => {
  return {
    type: actionTypes.startTrialStart
  };
};

export const startTrialSuccess = (body) => {
  return {
    type: actionTypes.startTrialSuccess,
    body: body
  };
};

export const startTrialFail = (error) => {
  return {
    type: actionTypes.startTrialFail,
    error: error
  };
};

export const showMessage = (message) => {
  return {
    type: actionTypes.showMessage,
    alertMessage: message,
    alertMessageHidden: false
  };
};

export const hideMessage = () => {
  return {
    type: actionTypes.hideMessage,
    alertMessageHidden: true,
    alertMessage: ''
  };
};

export const startTrial = () => {
  return async (dispatch) => {
    dispatch(startTrialStart());
    try {
      const response = await startTrialAPI();
      if (response.ok) {
        const body = await response.json();
        dispatch(showMessage('Trial started successfully'));
        dispatch(startTrialSuccess(body));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(startTrialFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(startTrialFail(e));
    }
  };
};


