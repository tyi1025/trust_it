import actionTypes from '../actions';

const defaultState = {
  footerHidden: false,
  alertMessageHidden: true,
  alertMessage: ''
};

export default function(state=defaultState, action) {
  switch(action.type) {
  case actionTypes.showFooter:
    return Object.assign({}, state, {
      footerHidden: false
    });
  case actionTypes.hideFooter:
    return Object.assign({}, state, {
      footerHidden: true
    });
  case actionTypes.showMessage:
    return Object.assign({}, state, {
      alertMessageHidden: action.alertMessageHidden,
      alertMessage: action.alertMessage
    });
  case actionTypes.hideMessage:
    return Object.assign({}, state, {
      alertMessageHidden: action.alertMessageHidden,
      alertMessage: action.alertMessage
    });
  default:
    return state;
  }
}
