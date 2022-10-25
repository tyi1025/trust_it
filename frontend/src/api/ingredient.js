export const searchIngredients = async (name) => {
  return await fetch(
    process.env.REACT_APP_API_URL + 'ingredients?q_name=' + name);
};
export const getIngredientScore = async (obj) => {
  return await fetch(process.env.REACT_APP_API_URL + 'get_score',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });
};

export const getIngredientById = async (id) => {
  return await fetch(process.env.REACT_APP_API_URL + `ingredients/${id}`);
};
