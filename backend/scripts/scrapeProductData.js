const fs = require('fs');
const puppeteer = require('puppeteer');

let products = JSON.parse(fs.readFileSync(
  __dirname + '/../data/products.json', {encoding:'utf8', flag:'r'}));

// Shuffle and use only 100 products
products = products.sort(() => 0.5 - Math.random());
products.splice(0, products.length - 800);

async function getProductData(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForTimeout(5000);
  let productData = await page.evaluate(() => {
    const nameTag = document.querySelector('#productTitle');
    const manufacturerTag = document.querySelector('.brand-title');
    const descriptionTag = document.querySelector('#prodDesc .inner');
    const warningTag = document.querySelector('#Warnings .inner');
    const ingredientsTag = document.querySelector('#Ingredients .inner');

    const name = nameTag && nameTag.textContent;
    const manufacturer = manufacturerTag && manufacturerTag.textContent;
    const description = descriptionTag && descriptionTag.textContent;
    const warning = warningTag && warningTag.textContent;
    const ingredients = ingredientsTag &&
          ingredientsTag.textContent.split(',').map(i => i.trim());

    const image1Tag = document.querySelector('#productImg');
    const imageOtherTags = Array.from(document.querySelectorAll('#thumbnailImages img'));

    let images = image1Tag ? [image1Tag.src] : [];
    images = images.concat(imageOtherTags.map((image) => {
      return image.src;
    }));

    return {
      name, manufacturer, ingredients, images,
      description: description + (warning ? '\n\n' + warning : '')
    };
  });
  await browser.close();
  console.log(productData);
  return productData;
}

(async () => {
  for (let i in products) {
    const data = await getProductData(products[i].url);
    console.log(i, data);
    fs.appendFileSync(
      __dirname + '/../data/products_with_data.json',
      JSON.stringify(Object.assign({}, products[i], data)) + '\n');
  }
})();
