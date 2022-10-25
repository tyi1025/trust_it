require('dotenv').config();
const { MONGO_URI } = process.env;

const {
  mongoose, Ingredient, Product
} = require('../models');

module.exports.calculateScores = async function calculateScores() {
  await mongoose.connect(MONGO_URI);

  const ingredientCursor = Ingredient.find().populate('effects').cursor();

  for (let ingredient = await ingredientCursor.next(); ingredient != null; ingredient = await ingredientCursor.next()) {
    let cancerScore = 1;
    let allergyScore = 1;
    let environmentScore = 1;
    if (ingredient.effects) {
      for (let effect of ingredient.effects) {
        switch (effect.effectType) {
        case 'cancer':
          cancerScore = Math.max(cancerScore, effect.score);
          break;
        case 'allergy':
          allergyScore = Math.max(allergyScore, effect.score);
          break;
        case 'environment':
          environmentScore = Math.max(environmentScore, effect.score);
          break;
        }
      }
    }
    ingredient.cancerScore = cancerScore;
    ingredient.allergyScore = allergyScore;
    ingredient.environmentScore = environmentScore;
    await ingredient.save();
  }

  const productCursor = Product.find().populate('ingredients').cursor();
  for (let product = await productCursor.next(); product != null; product = await productCursor.next()) {
    let cancerScore = 1;
    let allergyScore = 1;
    let environmentScore = 1;

    if (product.ingredients) {
      for (let ingredient of product.ingredients) {
        cancerScore = Math.max(cancerScore, ingredient.cancerScore);
        allergyScore = Math.max(allergyScore, ingredient.allergyScore);
        environmentScore = Math.max(environmentScore, ingredient.environmentScore);
      }
    }
    product.cancerScore = cancerScore;
    product.allergyScore = allergyScore;
    product.environmentScore = environmentScore;
    product.overallScore = Math.round((cancerScore + allergyScore + environmentScore) / 3);
    await product.save();
  }
};
