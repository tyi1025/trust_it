import { combineReducers } from 'redux';

import example from './example';
import product from './product';
import ingredient from './ingredient';
import auth from './auth';
import category from './category';
import productsInCategory from './productsInCategory';
import checkout from './checkout';
import invoice from './invoice';
import userInterface from './interface';

export default combineReducers({
  example,
  product,
  ingredient,
  auth,
  category,
  productsInCategory,
  checkout,
  invoice,
  userInterface
});
