require('dotenv').config();

const { MONGO_URI } = process.env;

const mongoose = require('mongoose');

mongoose.connect(MONGO_URI);

module.exports.mongoose = mongoose;
module.exports.Manufacturer = require('./manufacturer.js');
module.exports.Product = require('./product.js');
module.exports.Ingredient = require('./ingredient.js');
module.exports.Effect = require('./effect.js');
module.exports.Category = require('./category.js');
module.exports.Invoice = require('./invoice.js');
module.exports.IngredientSynonym = require('./ingredientSynonym.js');
