export const register = async (obj) => {
  return await fetch(
    process.env.REACT_APP_API_URL + 'registration',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });
};


export const login = async (obj) => {
  return await fetch(
    process.env.REACT_APP_API_URL + 'login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });
};
