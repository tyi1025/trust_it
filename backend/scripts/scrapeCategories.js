const fs = require('fs');
const axios = require('axios');

const categoriesUrl = 'https://www.walgreens.com/productsearch/v1/categories';

async function post(url, data) {
  return await axios({
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Trust me bro, I am like, totally Chrome'
    },
    data: data
  });
}

const categoriesList = [{
  name: 'Beauty',
  id: '359434',
  url: '/store/c/beauty-products/ID=359434-tier1',
  children: []
}, {
  name: 'Personal Care',
  id: '359436',
  url: '/store/c/personal-care/ID=359436-tier1',
  children: []
}];

async function buildCategories(parent, ids) {
  const resp = await post(categoriesUrl, { id: ids });
  if (!resp.data.categories) {
    return;
  }
  for (let category of resp.data.categories) {
    category.children = [];
    parent.children.push(category);
    await buildCategories(category, ids.concat([category.id]));
  }
}

(async () => {
  await buildCategories(categoriesList[0], [categoriesList[0].id]);
  await buildCategories(categoriesList[1], [categoriesList[1].id]);
  fs.writeFileSync(
    __dirname + '/../data/categories.json', JSON.stringify(categoriesList));
})();
