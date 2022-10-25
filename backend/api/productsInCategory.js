const express = require('express');
const { Product, Category } = require('../models');

const router = express.Router();

/**
 * @openapi
 * /products_in_category:
 *   get:
 *     description: Return a list of products in each category
 *     responses:
 *       200:
 *         description: Return result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       400:
 *         description: Incorrect ingredientId format / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.get('/products_in_category', async (_, res) => {
  try {
    const categories = await Category.find({parent: null}).lean().exec();

    for (let i in categories) {
      const products =
            await Product.find({category: categories[i]._id}).exec();
      categories[i].products = products;
    }

    res.send(categories);
  } catch(e) {
    res.status(400);
    res.send({'message': 'And unknown error occurred'});
  }
});

module.exports = router;
