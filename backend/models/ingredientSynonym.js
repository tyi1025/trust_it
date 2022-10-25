const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientSynonymSchema = new Schema({
  ingredient: { type: Schema.Types.ObjectId, ref: 'ingredient' },
  name: { type: String, required: true },
});

const IngredientSynonymModel = mongoose.model(
  'ingredientSynonym', IngredientSynonymSchema);

module.exports = IngredientSynonymModel;
