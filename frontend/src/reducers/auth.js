import actionTypes from '../actions';

const defaultState = {
  registerLoading: false,
  registeredManufacturer: {},
  registerError: null,
  loginLoading: false,
  loggedInManufacturer: {},
  jwtToken: '',
  loginError: null,
  getManufacturerLoading: false,
  getManufacturerError: null
};

export default function(state=defaultState, action) {
  switch(action.type) {
  case actionTypes.registerStart:
    return Object.assign({}, state, {
      registerLoading: true,
      registeredManufacturer: {},
      registerError: ''
    });
  case actionTypes.registerSuccess:
    return Object.assign({}, state, {
      registerLoading: false,
      registeredManufacturer: action.manufacturer,
      registerError: ''
    });
  case actionTypes.registerFail:
    return Object.assign({}, state, {
      registerLoading: false,
      registeredManufacturer: {},
      registerError: action.error.message
    });
  case actionTypes.loginStart:
    return Object.assign({}, state, {
      loginLoading: true,
      loggedInManufacturer: {},
      jwtToken: '',
      loginError: ''
    });
  case actionTypes.loginSuccess:
    return Object.assign({}, state, {
      loginLoading: false,
      loggedInManufacturer: action.body.manufacturer,
      jwtToken: action.body.token,
      loginError: ''
    });
  case actionTypes.logout:
    return Object.assign({}, state, {
      loggedInManufacturer: {},
      jwtToken: ''
    });
  case actionTypes.loginFail:
    return Object.assign({}, state, {
      loginLoading: false,
      loggedInManufacturer: {},
      jwtToken: '',
      loginError: action.error.message
    });
  case actionTypes.postCheckoutSuccess:
    return Object.assign({}, state, {
      loggedInManufacturer: action.body.manufacturer,
    });
  case actionTypes.startTrialSuccess:
    return Object.assign({}, state, {
      loggedInManufacturer: action.body.manufacturer
    });
  case actionTypes.getManufacturerSelfStart:
    return Object.assign({}, state, {
      getManufacturerLoading: true,
      getManufacturerError: null
    });
  case actionTypes.getManufacturerSelfSuccess:
    return Object.assign({}, state, {
      getManufacturerLoading: false,
      getManufacturerError: null,
      loggedInManufacturer: action.manufacturer
    });
  case actionTypes.getManufacturerSelfFail:
    return Object.assign({}, state, {
      getManufacturerLoading: true,
      getManufacturerError: action.error
    });
  case actionTypes.applyCertificateSuccess:
    return Object.assign({}, state, {
      loggedInManufacturer: action.body.manufacturer
    });
  default:
    return state;
  }
}
