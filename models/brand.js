const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true },
});

// Virtual for brand's URL
BrandSchema.virtual("url").get(function () {
  // Not using arrow function so we can use the 'this' keyword
  return `/catalog/brand/${this._id}`;
});

module.exports = mongoose.model("Brand", BrandSchema);
