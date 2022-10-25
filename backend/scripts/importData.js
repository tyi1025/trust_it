require('dotenv').config();
const { MONGO_URI } = process.env;

const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');
const mongodb = require('mongodb');

const {
  mongoose, Category, Effect, Ingredient, IngredientSynonym, Product, Manufacturer
} = require('../models');

function convertId(id) {
  return id.padStart(12, '0');
}

async function importCategories() {
  await Category.deleteMany({});

  const categories = JSON.parse(
    fs.readFileSync(__dirname + '/../data/categories.json'));

  async function buildCategory(parent, category) {
    const newCategory = new Category({
      _id: convertId(category.id),
      name: category.name,
      description: category.name,
      parent: parent,
      isLeaf: category.children.length === 0
    });
    await newCategory.save();
    for (let child of category.children) {
      await buildCategory(newCategory, child);
    }
  }

  for (let category of categories) {
    await buildCategory(undefined, category);
  }
}

async function importEffects() {
  await Effect.deleteMany({});

  let effects = JSON.parse(
    fs.readFileSync(__dirname + '/../data/effects.json'));

  for (let effect of effects) {
    const newEffect = new Effect({
      _id: convertId(effect._id),
      name: effect.name,
      description: effect.description,
      effectType: effect.effectType,
      score: effect.score
    });
    await newEffect.save();
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/../data/new_effects.json'),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const effect = JSON.parse(line);
    const newEffect = new Effect({
      _id: convertId(effect._id),
      name: effect.name,
      description: effect.description,
      effectType: effect.effectType,
      score: effect.score
    });
    await newEffect.save();
  }

  // await events.once(rl, 'close');
}

async function importIngredients() {
  await Ingredient.deleteMany({});

  const rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/../data/ingredients.json'),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const ingredient = JSON.parse(line);

    const effects = [];
    for (let effect of ingredient.effects) {
      if (effect._id) {
        effects.push(effect._id);
      } else {
        effects.push(convertId(effect));
      }
    }

    const newIngredient = new Ingredient({
      name: ingredient.name,
      description: ingredient.description || ' ',
      effects: effects
    });
    await newIngredient.save();
  }

  // await events.once(rl, 'close');
}

async function importIngredientSynonyms() {
  await IngredientSynonym.deleteMany({});

  const rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/../data/synonyms.json'),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const synonym = JSON.parse(line);
    const ingredient = await Ingredient.find({name: synonym.ingredient});
    const newSynonym = new IngredientSynonym({
      ingredient: ingredient._id,
      name: synonym.name
    });
    await newSynonym.save();
  }

  // await events.once(rl, 'close');
}

async function importProducts() {
  await Product.deleteMany({});
  await Manufacturer.deleteMany({});

  const rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/../data/products_with_data.json'),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const product = JSON.parse(line);

    if (!product.name) {
      continue;
    }

    let manufacturer = await Manufacturer.findOne({name: product.manufacturer});
    if (!manufacturer) {
      try {
        manufacturer = new Manufacturer({
          name: product.manufacturer,
          username: product.manufacturer.toLowerCase().replace(/[\W_]+/g, ''),
          password: '12345678'
        });
        await manufacturer.save();
      } catch {
        // Ingore duplicated username
      }
    }

    const ingredients = [];
    if (Array.isArray(product.ingredients)) {
      for (let item of product.ingredients) {
        const ingredient = await Ingredient.findOne({name: item});
        ingredient && ingredients.push(ingredient._id);
      }
    }
    const newProduct = new Product({
      name: product.name,
      manufacturer: manufacturer._id,
      description: product.description || ' ',
      ingredients: ingredients,
      category: convertId(product.category)
    });
    await newProduct.save();
  }

  // await events.once(rl, 'close');
}

async function importProductImages() {
  const rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/../data/products_with_data.json'),
    crlfDelay: Infinity
  });
  let bucket = new mongodb.GridFSBucket(
    mongoose.connection.db, {bucketName: 'photos'});
  try {
    await bucket.drop();
  } catch(e) {
    // Ignore NamespaceNotFound when during first time import
    if (e.codeName !== 'NamespaceNotFound') {
      throw e;
    }
  }
  bucket = new mongodb.GridFSBucket(
    mongoose.connection.db, {bucketName: 'photos'});

  for await (const line of rl) {
    const product = JSON.parse(line);
    const productObj = await Product.findOne({name: product.name});

    if (!productObj) {
      continue;
    }

    for (let url of product.images) {
      const hash = crypto.createHash('sha256').update(url).digest('hex');

      const file = await new Promise((resolve, reject) => {
        fs.createReadStream(
          __dirname + '/../data/images/' + hash + '.jpg')
          .pipe(bucket.openUploadStream(hash + '.jpg'))
          .on('finish', (file) => resolve(file))
          .on('error', (e) => reject(e));
      });

      if (!productObj.images) {
        productObj.images = [file._id];
      } else {
        productObj.images.push(file._id);
      }
    }
    await productObj.save();
  }
}

(async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Importing Categories');
  await importCategories();
  console.log('Importing Effects');
  await importEffects();
  console.log('Importing Ingredients');
  await importIngredients();
  console.log('Importing Ingredients Synonyms');
  await importIngredientSynonyms();
  console.log('Importing Products');
  await importProducts();
  console.log('Importing Images');
  await importProductImages();

  process.exit();
})();
