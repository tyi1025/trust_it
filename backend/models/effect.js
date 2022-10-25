const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EffectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  effectType: {
    type: String,
    enum: ['cancer', 'allergy', 'environment'],
    required: true
  },
  score: { type: Number, min: 1, max: 10, default: 1 }
});

const EffectModel = mongoose.model('effect', EffectSchema);

module.exports = EffectModel;
