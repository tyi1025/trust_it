const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const ManufacturerSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    username: {
      type: String,
      match: [
        /^[a-zA-Z0-9]+$/, 'Username can only contain alphanumeric characters'],
      unique: true, sparse: true
    },
    password: { type: String },
    certificateQuota: { type: Number, default: 0 },
    trialStartDate: { type: Date },
    paid: { type: Boolean, default: false }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }}
).pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

ManufacturerSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

ManufacturerSchema.virtual('trialStatus').get(function () {
  if (!this.trialStartDate) {
    return 'inactive';
  }
  const date = (new Date()).getTime();
  const trialExpireDate = new Date(
    this.trialStartDate.setDate(this.trialStartDate.getDate() + 30));
  if (date <= trialExpireDate) {
    return 'active';
  } else {
    return 'used';
  }
});

const ManufacturerModel = mongoose.model('manufacturer', ManufacturerSchema);

module.exports = ManufacturerModel;
