import actionTypes from '.';

export const showFooter = () => {
  return {
    type: actionTypes.showFooter
  };
};

export const hideFooter = () => {
  return {
    type: actionTypes.hideFooter
  };
};

export const showMessage = (alertMessage) => {
  return {
    type: actionTypes.showMessage,
    alertMessage: alertMessage,
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