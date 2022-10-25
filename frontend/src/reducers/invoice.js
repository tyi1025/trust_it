import actionTypes from '../actions';

const defaultState = {
  getInvoiceLoading: false,
  getInvoiceError: null,
  invoice: null
};

export default function (state = defaultState, action) {
  switch (action.type) {
  case actionTypes.getInvoiceStart:
    return Object.assign({}, state, {
      getInvoiceLoading: true,
      invoice: null,
      getInvoiceError: null
    });
  case actionTypes.getInvoiceSuccess:
    return Object.assign({}, state, {
      getInvoiceLoading: false,
      invoice: action.invoice,
      getInvoiceError: null
    });
  case actionTypes.getInvoiceFail:
    return Object.assign({}, state, {
      getInvoiceLoading: false,
      getInvoiceError: action.error
    });
  default:
    return state;
  }
}
