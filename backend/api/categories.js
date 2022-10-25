const express = require('express');
const { Category } = require('../models');
const { comeOnMongoReally } = require('../utils/regexEscape');

const router = express.Router();

/**
 * @openapi
 * /products:
 *   get:
 *     description: Get categories
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
 *         description: Number of categories per page
 *       - in: query
 *         name: q_name
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Search categories with name containing this string.
 *     responses:
 *       200:
 *         description: Return products matching the search conditions
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
router.get('/categories', async (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.per_page || 20;
  const qName = req.query.q_name;

  if (!Number.isInteger(parseInt(page)) || !Number.isInteger(parseInt(perPage))) {
    res.status(400);
    res.json({'message': 'page and per_page must be integers'});
    return;
  }

  try {
    let query = Category.find();

    if (qName) {
      query = Category.find({
        'name': { '$regex': comeOnMongoReally(qName), $options: 'i' }});
    }

    const categories =
      await query.limit(perPage).skip((page - 1) * perPage).exec();

    res.send(categories);
  } catch (e) {
    res.status(400);
    res.send({ 'message': 'An unknown error occurred' });
  }
});

/**
 * @openapi
 * /products:
 *   get:
 *     description: Get all categories in a tree
 *     responses:
 *       200:
 *         description: Return products matching the search conditions
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
router.get('/categories/tree', async (_, res) => {
  async function fillChildren(parents) {
    for (let i in parents) {
      const categories = await Category.find(
        {parent: parents[i]._id}).lean().exec();

      await fillChildren(categories);
      parents[i].children = categories;
    }
  }

  try {
    const roots = await Category.find({parent: null}).lean().exec();
    await fillChildren(roots);
    res.send(roots);
  } catch (e) {
    res.status(400);
    res.send({ 'message': 'An unknown error occurred' });
  }
});

module.exports = router;
