require('dotenv').config();
const { MONGO_URI } = process.env;

const { exec } = require('child_process');

exec([
  'mongoexport',
  '--uri=' + MONGO_URI,
  '--collection=categories',
  '--out="' + __dirname + '/../data/export/categories.json"'
].join(' '));

exec([
  'mongoexport',
  '--uri=' + MONGO_URI,
  '--collection=effects',
  '--out="' + __dirname + '/../data/export/effects.json"'
].join(' '));

exec([
  'mongoexport',
  '--uri=' + MONGO_URI,
  '--collection=ingredients',
  '--out="' + __dirname + '/../data/export/ingredients.json"'
].join(' '));

exec([
  'mongoexport',
  '--uri=' + MONGO_URI,
  '--collection=ingredientsynonyms',
  '--out="' + __dirname + '/../data/export/ingredientsynonyms.json"'
].join(' '));

exec([
  'mongoexport',
  '--uri=' + MONGO_URI,
  '--collection=manufacturers',
  '--out="' + __dirname + '/../data/export/manufacturers.json"'
].join(' '));

exec([
  'mongoexport',
  '--uri=' + MONGO_URI,
  '--collection=photos.chunks',
  '--out="' + __dirname + '/../data/export/photos.chunks.json"'
].join(' '));

exec([
  'mongoexport',
  '--uri=' + MONGO_URI,
  '--collection=photos.files',
  '--out="' + __dirname + '/../data/export/photos.files.json"'
].join(' '));

exec([
  'mongoexport',
  '--uri=' + MONGO_URI,
  '--collection=products',
  '--out="' + __dirname + '/../data/export/products.json"'
].join(' '));

exec([
  'mongoexport',
  '--uri=' + MONGO_URI,
  '--collection=invoices',
  '--out="' + __dirname + '/../data/export/invoices.json"'
].join(' '));
