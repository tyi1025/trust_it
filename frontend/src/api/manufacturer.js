import { store } from '../store';

export const getManufacturerSelf = async () => {
  const state = store.getState();
  return await fetch(
    process.env.REACT_APP_API_URL + 'auth/manufacturers/self',
    {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + state.auth.jwtToken
      }
    });
};
