const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'category' },
  isLeaf: { type: Boolean, default: false }
});

const CategoryModel = mongoose.model('category', CategorySchema);

module.exports = CategoryModel;
