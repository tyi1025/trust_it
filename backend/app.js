require('dotenv').config();

const { PORT, JWT_KEY } = process.env;

const express = require('express');
const cors = require('cors');
var { expressjwt: jwt } = require('express-jwt');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { calculateScores } = require('./utils/scores');

const manufacturers = require('./api/manufacturers');
const products = require('./api/products');
const ingredients = require('./api/ingredients');
const categories = require('./api/categories');
const scoreCalculator = require('./api/scoreCalculator');
const auth = require('./api/auth');
const upload = require('./api/upload');
const productsInCategory = require('./api/productsInCategory');
const checkout = require('./api/checkout');
const invoice = require('./api/invoice');

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  '/api/auth/',
  jwt({
    secret: JWT_KEY,
    algorithms: ['HS256']
  })
);

app.use('/api', manufacturers);
app.use('/api', products);
app.use('/api', ingredients);
app.use('/api', categories);
app.use('/api', scoreCalculator);
app.use('/api', auth);
app.use('/api', upload);
app.use('/api', productsInCategory);
app.use('/api', checkout);
app.use('/api', invoice);

calculateScores().then(() => {
  console.log('Scores updated!');
}).catch((e) => {
  console.error('Error updating scores!', e);
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trust-It! API Documentation',
      version: '1.0.0',
    },
  },
  apis: ['./swagger-definitions.js', './api/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(function(req, res){
  res.status(404).send({
    'message': 'This is not the API you are looking for!'
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
