import { store } from '../store';

export const getInvoice = async (invoiceId) => {
  const state = store.getState();
  return await fetch(
    process.env.REACT_APP_API_URL + 'auth/invoices/' + invoiceId,
    {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + state.auth.jwtToken
      }
    });
};
