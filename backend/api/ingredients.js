const express = require('express');
const mongoose = require('mongoose');
const { Ingredient } = require('../models');
const { comeOnMongoReally } = require('../utils/regexEscape');

const router = express.Router();

/**
 * @openapi
 * /ingredients:
 *   get:
 *     description: Get a list of ingredients
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         default: 0
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *         required: false
 *         default: 0
 *         description: Number of products per page
 *       - in: query
 *         name: q_name
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Search ingredients with name containing this string.
 *     responses:
 *       200:
 *         description: Return ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.get('/ingredients', async (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.per_page || 20;
  const qName = req.query.q_name;

  if (!Number.isInteger(parseInt(page)) || !Number.isInteger(parseInt(perPage))) {
    res.status(400);
    res.json({'message': 'page and per_page must be integers'});
    return;
  }

  try {
    let query = Ingredient.find();

    if (qName) {
      query = Ingredient.find({
        'name': { '$regex': comeOnMongoReally(qName), $options: 'i' }});
    }

    const ingredients =
      await query.limit(perPage).skip((page - 1) * perPage).exec();
    res.send(ingredients);
  } catch (e) {
    res.status(400);
    res.send({'message': 'And unknown error occurred'});
  }
});

/**
 * @openapi
 * /ingredients/{ingredientId}:
 *   get:
 *     description: Get ingredient by id
 *     parameters:
 *       - in: path
 *         name: ingredientId
 *         schema:
 *           type: string
 *         required: true
 *         description: Must be a valid Mongo ObjectId
 *     responses:
 *       200:
 *         description: Return the ingredient with the given ingredientId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Incorrect ingredientId format / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       404:
 *         description: Ingredient not found
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.get('/ingredients/:ingredientId', async (req, res) => {
  const ingredientId = req.params.ingredientId;

  if (typeof ingredientId === 'undefined') {
    res.status(400);
    res.send({'message': ':ingredientId is required'});
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(ingredientId)) {
    res.status(400);
    res.send({'message': `Id (${ingredientId}) is not valid`});
    return;
  }

  try {
    const ingredient = await Ingredient.findById(ingredientId).populate('effects').exec();
    if (ingredient === null) {
      res.status(404);
      res.send({ 'message': `Ingredient with Id (${ingredientId}} not found` });
      return;
    }
    res.send(ingredient);
  } catch (e) {
    res.status(400);
    res.send({'message': 'And unknown error occurred'});
  }
});

/**
 * @openapi
 * /ingredients:
 *   post:
 *     description: Create new ingredient
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         schema:
 *           type: object
 *         required: true
 *         description: Must be a valid Ingredient schema
 *     responses:
 *       200:
 *         description: Return the created ingredient
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Incorrect ingredient format / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.post('/ingredients', async (req, res) => {
  try {
    const newIngredient = new Ingredient(req.body);
    await newIngredient.save();
    res.send(newIngredient);
  } catch (e) {
    res.status(400);
    if (e instanceof mongoose.Error.ValidationError) {
      res.send({'message': e.toString()});
      return;
    }
    res.send({'message': 'An unknown error occurred'});
  }
});

/**
 * @openapi
 * /ingredients/{ingredientId}:
 *   put:
 *     description: Update an ingredient with the given ingredientId
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: ingredientId
 *         schema:
 *           type: string
 *         required: true
 *         description: Must be a valid Mongo ObjectId
 *       - in: body
 *         schema:
 *           type: object
 *         required: true
 *         description: Must be a valid Ingredient schema
 *     responses:
 *       200:
 *         description: Return the created ingredient
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Incorrect ingredientId format / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       404:
 *         description: Ingredient not found
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.put('/ingredients/:ingredientId', async (req, res) => {
  const ingredientId = req.params.ingredientId;

  if (typeof ingredientId === 'undefined') {
    res.status(400);
    res.send({'message': ':ingredientId is required'});
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(ingredientId)) {
    res.status(400);
    res.send({'message': `Id (${ingredientId}) is not valid`});
    return;
  }

  try {
    const ingredient = await Ingredient.findByIdAndUpdate(
      ingredientId, req.body, {new: true}).exec();

    if (ingredient === null) {
      res.status(404);
      res.send({ 'message': `Ingredient with Id (${ingredientId}} not found` });
      return;
    }
    res.send(ingredient);
  } catch (e) {
    res.status(400);
    if (e instanceof mongoose.Error.ValidationError) {
      res.send({'message': e.toString()});
      return;
    }
    res.send({'message': 'An unknown error occurred'});
  }
});

/**
 * @openapi
 * /ingredients/{ingredientId}:
 *   delete:
 *     description: Delete an ingredient with the given ingredientId
 *     parameters:
 *       - in: path
 *         name: ingredientId
 *         schema:
 *           type: string
 *         required: true
 *         description: Must be a valid Mongo ObjectId
 *     responses:
 *       200:
 *         description: Return the deleted ingredient
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Incorrect ingredientId format / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       404:
 *         description: Ingredient not found
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.delete('/ingredients/:ingredientId', async (req, res) => {
  const ingredientId = req.params.ingredientId;

  if (typeof ingredientId === 'undefined') {
    res.status(400);
    res.send({'message': ':ingredientId is required'});
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(ingredientId)) {
    res.status(400);
    res.send({'message': `Id (${ingredientId}) is not valid`});
    return;
  }

  try {
    const ingredient = await Ingredient.findByIdAndDelete(ingredientId).exec();
    if (ingredient === null) {
      res.status(404);
      res.send({ 'message': `Ingredient with Id (${ingredientId}} not found` });
      return;
    }
    res.send(ingredient);
  } catch (e) {
    res.status(400);
    res.send({'message': 'An unknown error occurred'});
  }
});

module.exports = router;
