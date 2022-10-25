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

(async () => {
  const cursor = Product.find({'certificationStatus': 'pending'}).cursor();

  for (let product = await cursor.next(); product !== null; product = await cursor.next()) {
    const input = await getInput(`Product "${product.name} (${product._id})" \
by manufacturer "${product.manufacturer.name} (${product.manufacturer._id})" \
is pending for approval, approve? (y/N): `);

    if (input === 'y') {
      product.certificationStatus = 'certified';
      product.certificationDate = new Date();
      await product.save();
    }
  }

  console.log('All done!');
  rl.close();
  process.exit();

})();
