import { store } from '../store';

export const preCheckout = async (obj) => {
  const state = store.getState();
  return await fetch(
    process.env.REACT_APP_API_URL + 'auth/pre_checkout',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + state.auth.jwtToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });
};

export const postCheckout = async (obj) => {
  const state = store.getState();
  return await fetch(
    process.env.REACT_APP_API_URL + 'auth/post_checkout',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + state.auth.jwtToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });
};

export const startTrial = async () => {
  const state = store.getState();
  return await fetch(
    process.env.REACT_APP_API_URL + 'auth/start_trial',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + state.auth.jwtToken,
        'Content-Type': 'application/json'
      }
    });
};
