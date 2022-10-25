export const getProductsInCategory = async () => {
  return await fetch(process.env.REACT_APP_API_URL + 'products_in_category');
};
