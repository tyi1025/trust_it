const express = require('express');
const { Manufacturer } = require('../models');

const router = express.Router();

/**
 * @openapi
 * /auth/manufacturers/self:
 *   get:
 *     description: Get the logged in manufacturer
 *     responses:
 *       200:
 *         description: Return the logged manufacturer
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
 */
router.get('/auth/manufacturers/self', async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findOne(
      {username: req.auth.username});
    res.send(manufacturer);
  } catch (e) {
    res.status(400);
    res.send({'message': 'And unknown error occurred'});
  }
});

module.exports = router;
