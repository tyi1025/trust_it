require('dotenv').config();

const { JWT_KEY } = process.env;

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Manufacturer } = require('../models');

const router = express.Router();

/**
 * @openapi
 * /api/registration:
 *   post:
 *     description: Allow manufacturer to register
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             username:
 *               type: string
 *             password:
 *               type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Return the created Manufacturer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: >
 *           Incorrect request body format /
 *           name or username already in use /
 *           unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.post('/registration', async (req, res) => {
  try {
    const newManufacturer = new Manufacturer(req.body);
    await newManufacturer.save();
    res.send(newManufacturer);
  } catch (e) {
    res.status(400);
    if (e instanceof mongoose.Error.ValidationError) {
      res.send({'message': e.toString()});
      return;
    } else if (e.code === 11000) {
      console.log(e);
      if ('username' in e.keyPattern) {
        res.send({'message': 'Username already in use'});
        return;
      } else if ('name' in e.keyPattern) {
        res.send({'message': 'Name already in use'});
        return;
      }
    }
    res.send({'message': 'An unknown error occurred'});
  }
});

/**
 * @openapi
 * /api/login:
 *   post:
 *     description: Allow manufacturer to login
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               manufacturer:
 *                 type: object
 *               token:
 *                 type: string
 *       400:
 *         description: Unknown error
 *         content:
 *           $ref: '#/definitions/GenericError'
 *       403:
 *         description: Incorrect username / password
 *         content:
 *           $ref: '#/definitions/GenericError'
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const manufacturer =
          await Manufacturer.findOne({username: username}).exec();

    if (!manufacturer) {
      res.status(401);
      res.send({'message': 'Incorrect username / password'});
      return;
    }

    bcrypt.compare(password, manufacturer.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ username }, JWT_KEY, {
          algorithm: 'HS256',
        });
        res.send({ 'manufacturer': manufacturer, token: token });
      } else if (err) {
        res.status(400);
        res.send({'message': 'An unknown error occurred'});
      } else {
        res.status(401);
        res.send({'message': 'Incorrect username / password'});
      }
    });
  } catch (e) {
    res.status(400);
    res.send({'message': 'An unknown error occurred'});
  }
});

module.exports = router;
