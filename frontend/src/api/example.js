export const getManufacturers = async () => {
  return await fetch(process.env.REACT_APP_API_URL + 'manufacturers');
};
export const getProducts = async () => {
  return await fetch(process.env.REACT_APP_API_URL + 'products');
};
export const getProductDetails = async ( {productId}) => {
  return await fetch(process.env.REACT_APP_API_URL + 'products/' + productId);
};
export const getIngredientScore = async (obj) => {
  return await fetch(process.env.REACT_APP_API_URL + 'getscore',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });
};