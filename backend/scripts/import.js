require('dotenv').config();
const { MONGO_URI } = process.env;

const { exec } = require('child_process');

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, _) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout)
    });
  });
}

(async () => {
  await execCommand([
    'mongoimport',
    '--drop',
    '--uri=' + MONGO_URI,
    '--file="' + __dirname + '/../data/export/categories.json"'
  ].join(' '));

  await execCommand([
    'mongoimport',
    '--drop',
    '--uri=' + MONGO_URI,
    '--file="' + __dirname + '/../data/export/effects.json"'
  ].join(' '));

  await execCommand([
    'mongoimport',
    '--drop',
    '--uri=' + MONGO_URI,
    '--file="' + __dirname + '/../data/export/ingredients.json"'
  ].join(' '));

  await execCommand([
    'mongoimport',
    '--drop',
    '--uri=' + MONGO_URI,
    '--file="' + __dirname + '/../data/export/ingredientsynonyms.json"'
  ].join(' '));

  await execCommand([
    'mongoimport',
    '--drop',
    '--uri=' + MONGO_URI,
    '--file="' + __dirname + '/../data/export/manufacturers.json"'
  ].join(' '));

  await execCommand([
    'mongoimport',
    '--drop',
    '--uri=' + MONGO_URI,
    '--file="' + __dirname + '/../data/export/photos.chunks.json"'
  ].join(' '));

  await execCommand([
    'mongoimport',
    '--drop',
    '--uri=' + MONGO_URI,
    '--file="' + __dirname + '/../data/export/photos.files.json"'
  ].join(' '));

  await execCommand([
    'mongoimport',
    '--drop',
    '--uri=' + MONGO_URI,
    '--file="' + __dirname + '/../data/export/products.json"'
  ].join(' '));

  await execCommand([
    'mongoimport',
    '--drop',
    '--uri=' + MONGO_URI,
    '--file="' + __dirname + '/../data/export/invoices.json"'
  ].join(' '));

})();
