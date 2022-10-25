const express = require('express');
const mongoose = require('mongoose');
const { Product, Manufacturer } = require('../models');
const { comeOnMongoReally } = require('../utils/regexEscape');

const router = express.Router();

/**
 * @openapi
 * /products:
 *   get:
 *     description: Get or search products
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
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Search products with name containing this string.
 *       - in: query
 *         name: barcode
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Search products with this barcode,
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Search products with this category.
 *       - in: query
 *         name: manufacturer
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Search products with this manufacturer.
 *       - in: query
 *         name: min_score
 *         schema:
 *           type: int
 *         required: false
 *         description: >
 *           Search products with score greater than or equal to this.
 *       - in: query
 *         name: max_score
 *         schema:
 *           type: int
 *         required: false
 *         description: >
 *           Search products with score less than or equal to this.
 *       - in: query
 *         name: certified_status
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Search products with certified status
 *       - in: query
 *         name: pending_status
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Search products with pending status
 *       - in: query
 *         name: none_status
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Search products with none status
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
 *         description: Incorrect productId format / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.get('/products', async (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.per_page || 20;
  const qName = req.query.name || req.query.keyword;
  const qBarcode = req.query.barcode;
  const qCategory = req.query.category;
  const qManufacturer = req.query.manufacturer;
  const qMinScore = req.query.min_score;
  const qMaxScore = req.query.max_score;
  const qCertified = req.query.certified_status;
  const qPending = req.query.pending_status;
  const qNone = req.query.none_status;

  if ((qMinScore && isNaN(parseInt(qMinScore))) ||
      (qMaxScore && isNaN(parseInt(qMaxScore)))) {
    res.status(400);
    res.send({'message': 'Invalid query parameters'});
    return;
  }

  const searchConditions = {};

  if (qName) {
    searchConditions['name'] =
      { '$regex': comeOnMongoReally(qName) , $options: 'i' };
  }
  if (qBarcode) {
    searchConditions['barcode'] = qBarcode;
  }
  if (qCategory) {
    searchConditions['category'] = qCategory;
  }
  if (qManufacturer) {
    searchConditions['manufacturer'] = qManufacturer;
  }
  if (qMinScore) {
    searchConditions['overallScore'] = {$gte: parseInt(qMinScore)};
  }
  if (qMaxScore) {
    if (searchConditions['overallScore']) {
      searchConditions['overallScore'].$lte = parseInt(qMaxScore);
    } else {
      searchConditions['overallScore'] = {$lte: parseInt(qMaxScore)};
    }
  }

  searchConditions.$or = [];
  if (qCertified) {
    searchConditions.$or.push({certificationStatus: 'certified'});
  }
  if (qPending) {
    searchConditions.$or.push({certificationStatus: 'pending'});
  }
  if (qNone) {
    searchConditions.$or.push({certificationStatus: 'none'});
  }
  if (searchConditions.$or.length === 0) {
    delete searchConditions.$or;
  }

  let products = await Product.find(searchConditions).populate({path: 'category'})
    .limit(perPage).skip((page - 1) * perPage).sort('overallScore').exec();

  res.send(products);
});

/**
 * @openapi
 * /products/{productId}:
 *   get:
 *     description: Get product by id
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: Must be a valid Mongo ObjectId
 *     responses:
 *       200:
 *         description: Return the product with the given productId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Incorrect productId format / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       404:
 *         description: Product not found
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.get('/products/:productId', async (req, res) => {
  const productId = req.params.productId;

  if(typeof productId === 'undefined') {
    res.status(400);
    res.send({'message': ':productid is required'});
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    res.send({'message': `Id (${productId}) is not valid`});
    return;
  }

  try {
    const product = await Product
      .findById(productId)
      .populate({
        path: 'ingredients',
        populate: {
          path: 'effects',
        }
      }).exec();
    if (product === null) {
      res.status(400);
      res.send({ 'message': `Product with Id (${productId}} not found` });
    } else {
      res.send(product);
    }
  } catch (e) {
    res.status(400);
    res.send({'message': 'And unknown error occurred'});
  }
});

/**
 * @openapi
 * /products:
 *   post:
 *     description: Create new product
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         schema:
 *           type: object
 *         required: true
 *         description: Must be a valid Product schema
 *     responses:
 *       200:
 *         description: Return the created Product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Incorrect product format / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       401:
 *         description: User not logged in
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.post('/auth/products', async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findOne(
      {username: req.auth.username});

    const newProduct = new Product(
      Object.assign({}, req.body, {manufacturer: manufacturer._id}));
    await newProduct.save();

    const product = await Product.findById(newProduct._id)
      .populate('ingredients').exec();

    res.send(product);
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
 * /auth/products/{productId}:
 *   put:
 *     description: Update the product with the given productId
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: Must be a valid Mongo ObjectId
 *       - in: body
 *         schema:
 *           type: object
 *         required: true
 *         description: Must be a valid Product schema
 *     responses:
 *       200:
 *         description: Return the created Product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Incorrect productId format / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       401:
 *         description: User not logged in
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       404:
 *         description: Product not found
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.put('/auth/products/:productId', async (req, res) => {
  const productId = req.params.productId;

  if (typeof productId === 'undefined') {
    res.status(400);
    res.send({'message': `Id (${productId}) is not valid`});
    return;
  }

  const product = await Product.findById(productId).exec();

  if (product === null) {
    res.status(404);
    res.send({ 'message': `Product with Id (${productId}} not found` });
    return;
  } else if (req.auth.username !== product.manufacturer.username) {
    res.status(403);
    res.send({ 'message': 'Not authorized to edit this product' });
    return;
  }

  try {
    product.name = req.body.name;
    product.description = req.body.description;
    product.category = req.body.category;
    product.affiliateLink = req.body.affiliateLink;
    product.ingredients = req.body.ingredients;
    product.images = req.body.images;
    product.barcode = req.body.barcode;
    await product.save();

    const updatedProduct = await Product.findById(productId)
      .populate('ingredients').exec();
    res.send(updatedProduct);
  } catch (e) {
    res.status(400);
    if (e instanceof mongoose.Error.ValidationError) {
      res.send({ 'message': e.toString() });
      return;
    }
    res.send({ 'message': 'An unknown error occurred' });
  }
});

/**
 * @openapi
 * /auth/apply_certificate:
 *   post:
 *     description: Apply certificate for the product with the given id
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         schema:
 *           type: array
 *         required: true
 *         description: An array of productIds
 *     responses:
 *       200:
 *         description: Return the updated product and manufacturer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Incorrect productId format / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       401:
 *         description: User not logged in
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       403:
 *         description: User not authorized / not enough quota to apply for certificate
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       404:
 *         description: Product not found
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.post('/auth/apply_certificate', async (req, res) => {
  try {
    const products = await Product.find({
      '_id': {
        $in: req.body
      }
    }).exec();

    const session = await mongoose.startSession();
    session.startTransaction();

    const manufacturer = await Manufacturer.findOne(
      { username: req.auth.username });

    for (let product of products) {
      if (req.auth.username !== product.manufacturer.username) {
        res.status(403);
        res.send({ 'message': 'Not authorized to apply certificate this product' });
        return;
      }

      if (manufacturer.certificateQuota <= 0) {
        res.status(403);
        res.send({ 'message': 'Not enough quota' });
        return;
      }

      product.certificationStatus = 'pending';
      product.certificationApplicationDate = new Date();
      await product.save();

      manufacturer.certificateQuota -= 1;
      await manufacturer.save();
    }

    const updatedProducts = await Product.find({
      '_id': {
        $in: req.body
      }
    }).populate('ingredients').exec();
    const updatedManufacturer = await Manufacturer.findOne(
      { username: req.auth.username });

    res.send({
      products: updatedProducts,
      manufacturer: updatedManufacturer
    });

    session.endSession();
  } catch (e) {
    res.status(400);
    if (e instanceof mongoose.Error.ValidationError) {
      res.send({ 'message': e.toString() });
      return;
    }
    res.send({ 'message': 'An unknown error occurred' });
  }
});

module.exports = router;
