export const getCategories = async () => {
  return await fetch(process.env.REACT_APP_API_URL + 'categories');
};

export const searchCategories = async (name) => {
  return await fetch(
    process.env.REACT_APP_API_URL + 'categories?q_name=' + name);
};

export const getCategoryTree = async () => {
  return await fetch(process.env.REACT_APP_API_URL + 'categories/tree');
};
