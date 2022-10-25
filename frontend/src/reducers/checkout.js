import actionTypes from '../actions';

const defaultState = {
  preCheckoutLoading: false,
  preCheckoutError: null,
  paymentIntent: null,
  postCheckoutLoading: false,
  postCheckoutError: null,
  invoice: null,
  startTrialLoading: false,
  startTrialError: null,
  startTrialSuccess: false
};

export default function(state=defaultState, action) {
  switch(action.type) {
  case actionTypes.preCheckoutStart:
    return Object.assign({}, state, {
      preCheckoutLoading: true,
      paymentIntent: null,
      preCheckoutError: null
    });
  case actionTypes.preCheckoutSuccess:
    return Object.assign({}, state, {
      preCheckoutLoading: false,
      paymentIntent: action.paymentIntent,
      preCheckoutError: null
    });
  case actionTypes.preCheckoutFail:
    return Object.assign({}, state, {
      preCheckoutLoading: false,
      preCheckoutError: action.error.message
    });
  case actionTypes.postCheckoutStart:
    return Object.assign({}, state, {
      postCheckoutLoading: true,
      invoice: null,
      postCheckoutError: null
    });
  case actionTypes.postCheckoutSuccess:
    return Object.assign({}, state, {
      postCheckoutLoading: false,
      invoice: action.body.invoice,
      postCheckoutError: null
    });
  case actionTypes.postCheckoutFail:
    return Object.assign({}, state, {
      postCheckoutLoading: false,
      postCheckoutError: action.error.message
    });
  case actionTypes.startTrialStart:
    return Object.assign({}, state, {
      startTrialLoading: true,
      startTrialSuccess: false,
      startTrialError: null
    });
  case actionTypes.startTrialSuccess:
    return Object.assign({}, state, {
      startTrialLoading: false,
      startTrialSuccess: true,
      startTrialError: null
    });
  case actionTypes.startTrialFail:
    return Object.assign({}, state, {
      startTrialLoading: false,
      startTrialError: action.error.message
    });
  default:
    return state;
  }
}
