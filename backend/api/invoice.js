const express = require('express');
const mongoose = require('mongoose');
const { Invoice } = require('../models');

const router = express.Router();

/**
 * @openapi
 * /auth/invoices/{invoiceId}:
 *   get:
 *     description: Get invoice by id
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Must be a valid Mongo ObjectId
 *     responses:
 *       200:
 *         description: Return the invoice with the given invoiceId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Incorrect invoiceId format / unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       401:
 *         description: User not logged in
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       403:
 *         description: User do not have permission to see the invoice
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       404:
 *         description: Invoice not found
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.get('/auth/invoices/:invoiceId', async (req, res) => {
  const invoiceId = req.params.invoiceId;

  if (typeof invoiceId === 'undefined') {
    res.status(400);
    res.send({'message': ':invoiceId is required'});
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
    res.status(400);
    res.send({'message': `Id (${invoiceId}) is not valid`});
    return;
  }

  try {
    const invoice = await Invoice.findById(invoiceId)
      .populate('manufacturer').exec();
    if (invoice === null) {
      res.status(404);
      res.send({ 'message': `Invoice with Id (${invoiceId}} not found` });
    } else if (req.auth.username !== invoice.manufacturer.username) {
      res.status(403);
      res.send({ 'message': 'Not authorized to view this invoice' });
    } else {
      res.send(invoice);
    }
  } catch (e) {
    res.status(400);
    res.send({'message': 'And unknown error occurred'});
  }
});

module.exports = router;
