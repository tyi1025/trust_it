const readline = require('readline');
require('../models');
const Product = require('../models/product');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getInput(prompt) {
  return new Promise((callback, error) => {
    rl.question(prompt, (input) => {
      callback(input);
    }, () => {
      error();
    });
  });
}

let name, description, barcode = '';
let inputNew = true;

(async () => {
  while (inputNew) {
    name = await getInput('Name: ');
    description = await getInput('Description: ');
    barcode = await getInput('Barcode: ');

    const newProduct = new Product({
      name: name,
      description: description,
      barcode: barcode
    });

    try {
      await newProduct.save();
      console.log('Product created successfully!');
    } catch (e) {
      console.error(e);
    }

    inputNew = await getInput('Enter another product? (y/N): ');
    if (inputNew !== 'y') {
      inputNew = false;
    }
  }
  rl.close();
  process.exit();
})();

