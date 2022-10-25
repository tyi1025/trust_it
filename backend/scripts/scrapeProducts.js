const fs = require('fs');
const puppeteer = require('puppeteer');

const rootUrl = 'https://www.walgreens.com';

const categories = JSON.parse(fs.readFileSync(
  __dirname + '/../data/categories.json', {encoding:'utf8', flag:'r'}));
let productList = [];

async function getProductsFromPage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForTimeout(5000);
  let productUrls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(
      '.card__product .color__text-black')).map(
      (item) => {
        return item.href;
      });
  });

  const nextPageExists = await page.evaluate(() => {
    return !!document.querySelector('[name="searchnextclick"]') && !document.querySelector('[name="searchnextclick"]').disabled;
  });

  if (nextPageExists) {
    await page.click('[name="searchnextclick"]');
    await page.waitForTimeout(1000);
    const nextPageUrl = await page.evaluate(() => {
      return window.location.href;
    });
    productUrls = productUrls.concat(await getProductsFromPage(nextPageUrl));
  }

  await browser.close();

  return productUrls;
}

async function iterateCategories(categories) {
  for (let category of categories) {
    console.log(category.name);
    const url = rootUrl + category.url;
    const productUrls = await getProductsFromPage(url);

    productList = productList.concat(productUrls.map((item) => {
      return {
        category: category.name,
        url: item
      };
    }));

    if (category.children.length > 0) {
      await iterateCategories(category.children);
    }
  }
}

(async () => {
  await iterateCategories(categories);
  fs.writeFileSync(
    __dirname + '/../data/products.json', JSON.stringify(productList));
})();
