require('../models');
const mongoose = require('mongoose');

const Effect = require('../models/effect');
const Ingredient = require('../models/ingredient');
const Category = require('../models/category');
const Manufacturer = require('../models/manufacturer');
const Product = require('../models/product');


const data = require('./dummy_data.json');
const effects = data['effects'];
const ingredients = data['ingredients'];
const categories = data['categories'];
const manufacturers = data['manufacturers'];
const products = data['products'];

const effectMap = {};
const ingredientMap = {};
const categoryMap = {};
const manufacturerMap = {};

function convertId(obj) {
  return Object.assign(obj, {
    '_id': obj['_id'] ? obj['_id'].padStart(12, '0') : undefined
  });
}

function populateRef(map, obj) {
  return map[mongoose.Types.ObjectId(convertId(obj)['_id']).toString()];
}

function populateAllRefs(map, arr) {
  return arr.map((item) => {
    return populateRef(map, item);
  });
}

(async () => {
  await Effect.deleteMany({});
  await Promise.all(effects.map(async (effect) => {
    try {
      const newEffect = new Effect(convertId(effect));
      effectMap[newEffect['_id']] = newEffect;
      await newEffect.save();
    } catch (e) {
      console.error(e);
    }
  }));

  await Ingredient.deleteMany({});
  await Promise.all(ingredients.map(async (ingredient) => {
    try {
      ingredient.effects = populateAllRefs(effectMap, ingredient.effects);
      const newIngredient = new Ingredient(convertId(ingredient));
      ingredientMap[newIngredient['_id']] = newIngredient;
      await newIngredient.save();
    } catch (e) {
      console.error(e);
    }
  }));

  await Category.deleteMany({});
  await Promise.all(categories.map(async (category) => {
    try {
      if (category.parent) {
        category.parent = populateRef(categoryMap, category.parent);
      }
      const newCategory = new Category(convertId(category));
      categoryMap[newCategory['_id']] = newCategory;
      await newCategory.save();
    } catch (e) {
      console.error(e);
    }
  }));

  await Manufacturer.deleteMany({});
  await Promise.all(manufacturers.map(async (manufacturer) => {
    try {
      const newManufacturer = new Manufacturer(convertId(manufacturer));
      manufacturerMap[newManufacturer['_id']] = newManufacturer;
      await newManufacturer.save();
    } catch (e) {
      console.error(e);
    }
  }));

  await Product.deleteMany({});
  await Promise.all(products.map(async (product) => {
    try {
      product.manufacturer = populateRef(manufacturerMap, product.manufacturer);
      product.ingredients = populateAllRefs(ingredientMap, product.ingredients);
      product.category = populateRef(categoryMap, product.category);
      const newProduct = new Product(convertId(product));
      await newProduct.save();
    } catch (e) {
      console.error(e);
    }
  }));

  process.exit();
})();
