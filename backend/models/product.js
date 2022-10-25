const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  manufacturer: {
    type: Schema.Types.ObjectId, ref: 'manufacturer',autopopulate: true
  },
  description: { type: String, required: true },
  ingredients: [{
    type: Schema.Types.ObjectId, ref: 'ingredient'
  }],
  affiliateLink: { type: String },
  category: {
    type: Schema.Types.ObjectId, ref: 'category', autopopulate: true
  },
  certificationStatus: {
    type: String,
    enum: ['none', 'pending', 'certified'],
    default: 'none'
  },
  certificationApplicationDate: {
    type: Date
  },
  certificationDate: {
    type: Date
  },
  cancerScore: { type: Number, min: 1, max: 10, default: 1 },
  allergyScore: { type: Number, min: 1, max: 10, default: 1 },
  environmentScore: { type: Number, min: 1, max: 10, default: 1 },
  overallScore: { type: Number, min: 1, max: 10, default: 1 },
  barcode: { type: String, required: false },
  images: [{ type: Schema.Types.ObjectId, ref: 'photos.file' }],
});

ProductSchema.plugin(require('mongoose-autopopulate'));
const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;
