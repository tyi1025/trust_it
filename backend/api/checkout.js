const { STRIPE_SECRET_KEY } = process.env;

const express = require('express');
const mongoose = require('mongoose');
const stripe = require('stripe')(STRIPE_SECRET_KEY);

const { Manufacturer, Invoice } = require('../models');

const router = express.Router();

/**
 * @openapi
 * /auth/pre_checkout:
 *   post:
 *     description: Call stripe paymentIntent API to get client secret for use in frontend
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         schema:
 *           type: object
 *           properties:
 *             amount:
 *               type: integer
 *               description: Amount of payment in EUR
 *         required: true
 *     responses:
 *       200:
 *         description: Call to stripe API successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Stripe Payment Intent object
 *       400:
 *         description: Ivalid body format or unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       401:
 *         description: User not logged in
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.post('/auth/pre_checkout', async (req, res) => {
  if (!req.body.amount) {
    res.status(400);
    res.send({'message': 'Invalid body format'});
    return;
  }
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });
    res.send(paymentIntent);
  } catch (e) {
    res.status(400);
    res.send({'message': 'An unknown error occurred'});
  }
});

/**
 * @openapi
 * /auth/post_checkout:
 *   post:
 *     description: Save an invoice after payment is successful
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         schema:
 *           type: object
 *           properties:
 *             amount:
 *               type: object
 *               properties:
 *                 paymentIntent:
 *                   description: Stripe Payment Intent object
 *         required: true
 *     responses:
 *       200:
 *         description: Invoice successfully saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Invoice Schema
 *       400:
 *         description: Ivalid body format / Validation error / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       401:
 *         description: User not logged in
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.post('/auth/post_checkout', async (req, res) => {
  if (!req.body.paymentIntent || !req.body.amount) {
    res.status(400);
    res.send({'message': 'Invalid request body'});
    return;
  }
  const { paymentIntent, amount } = req.body;
  const manufacturer = await Manufacturer.findOne(
    {username: req.auth.username});

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    manufacturer.certificateQuota += amount;
    manufacturer.paid = true;
    manufacturer.save();

    const newInvoice = new Invoice({
      manufacturer,
      paymentIntent
    });
    await newInvoice.save();

    const updatedManufacturer = await Manufacturer.findOne(
      {username: req.auth.username});

    session.endSession();

    res.send({
      invoice: newInvoice,
      manufacturer: updatedManufacturer
    });
  } catch(e) {
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
 * /auth/start_trial:
 *   post:
 *     description: Start trial
 *     responses:
 *       200:
 *         description: Trial started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Stripe Payment Intent object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Trial is active or expired or unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.post('/auth/start_trial', async (req, res) => {
  try {
    let manufacturer = await Manufacturer.findOne(
      { username: req.auth.username });

    if (manufacturer.trialStatus === 'active') {
      res.status(400);
      res.send({ 'message': 'Trial is already active' });
      return;
    }
    if (manufacturer.trialStatus === 'used') {
      res.status(400);
      res.send({ 'message': 'Trial has expired' });
      return;
    }
    
    manufacturer.trialStartDate = new Date();
    manufacturer.certificateQuota += 10;
    await manufacturer.save();

    res.send({ 'manufacturer': manufacturer });
  } catch {
    res.status(400);
    res.send({ 'message': 'An unknown error occurred' });
  }
});

module.exports = router;
