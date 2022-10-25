const express = require('express');
const { Ingredient } = require('../models');

const router = express.Router();

/**
 * @openapi
 * /getscore:
 *   post:
 *     description: Getting scores from ingredient list
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         schema:
 *           type: object
 *         required: true
 *         description: Ingredient list with name of ingredients
 *     responses:
 *       200:
 *         description: Return the ingredientsDetails required by score calculator
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Incorrect ingredient List format / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.post('/get_score', async (req, res) => {
  const ingredientList = req.body;

  if (typeof ingredientList === 'undefined') {
    res.status(400);
    res.send({ 'message': ':ingredientList is required' });
    return;
  }

  try {
    const ingredients =
          await Ingredient.find().where('name').in(ingredientList).exec();
    if (ingredients.length === 0) {
      res.status(404);
      res.send({
        'message': `Ingredient with Name (${ingredientList}) not found` });
      return;
    }

    let cancerScore = 0, allergyScore = 0, environmentScore = 0;
    for (var index in ingredients) {
      cancerScore += ingredients[index].cancerScore;
      allergyScore += ingredients[index].allergyScore;
      environmentScore += ingredients[index].environmentScore;
    }
    cancerScore /= ingredients.length;
    allergyScore /= ingredients.length;
    environmentScore /= ingredients.length;
    let overallScore = (cancerScore + allergyScore + environmentScore) / 3;
    let ingredientDetails = {
      'overallScore': overallScore, 'cancerScore': cancerScore,
      'allergyScore': allergyScore, 'environmentScore': environmentScore,
      'ingredientList': ingredients
    };

    res.send(ingredientDetails);
  } catch (e) {
    res.status(400);
    res.send({ 'message': 'And unknown error occurred' });
  }
});

module.exports = router;
