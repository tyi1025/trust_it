const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  manufacturer: {
    type: Schema.Types.ObjectId, ref: 'manufacturer', required: true },
  paymentIntent: { type: Schema.Types.Map, required: true },
  createdAt: { type: Date, default: Date.now }
});

const InvoiceModel = mongoose.model('invoice', InvoiceSchema);

module.exports = InvoiceModel;
