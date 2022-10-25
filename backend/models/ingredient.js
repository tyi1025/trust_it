const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  cancerScore: { type: Number, min: 1, max: 10, default: 1 },
  allergyScore: { type: Number, min: 1, max: 10, default: 1 },
  environmentScore: { type: Number, min: 1, max: 10, default: 1 },
  effects: [{
    type: Schema.Types.ObjectId, ref: 'effect'
  }],
});

const IngredientModel = mongoose.model('ingredient', IngredientSchema);

module.exports = IngredientModel;
