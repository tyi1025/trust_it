import actionTypes from '.';
import {
  getInvoice as getInvoiceAPI
} from '../api/invoice';

import {
  showMessage
} from '../actions/checkout';

export const getInvoiceStart = () => {
  return {
    type: actionTypes.getInvoiceStart
  };
};

export const getInvoiceSuccess = (body) => {
  return {
    type: actionTypes.getInvoiceSuccess,
    invoice: body
  };
};

export const getInvoiceFail = (error) => {
  return {
    type: actionTypes.getInvoiceFail,
    error: error
  };
};

export const getInvoice = (invoiceId) => {
  return async (dispatch) => {
    dispatch(getInvoiceStart());
    try {
      const response = await getInvoiceAPI(invoiceId);
      if (response.ok) {
        const invoice = await response.json();
        dispatch(getInvoiceSuccess(invoice));
      } else {
        const e = await response.json();
        dispatch(showMessage(e.message));
        dispatch(getInvoiceFail(e));
      }
    } catch(e) {
      dispatch(showMessage(e.message));
      dispatch(getInvoiceFail(e));
    }
  };
};
