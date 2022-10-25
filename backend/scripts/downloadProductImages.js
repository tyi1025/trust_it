const events = require('events');
const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: fs.createReadStream(__dirname + '/../data/products_with_data.json'),
  crlfDelay: Infinity
});


(async () => {

  rl.on('line', async (line) => {
    const product = JSON.parse(line);

    for (let url of product.images) {
      const hash = crypto.createHash('sha256').update(url).digest('hex');

      const writer = fs.createWriteStream(
        __dirname + '/../data/images/' + hash + '.jpg');

      const response = await axios({
        url,
        method: 'get',
        responseType: 'stream'
      });

      response.data.pipe(writer);
    }
  });

  await events.once(rl, 'close');

})();
