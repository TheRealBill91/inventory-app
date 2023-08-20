const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StyleSchema = new Schema({
  name: { type: String, required: true },
});

// Virtual for style's URL
StyleSchema.virtual("url").get(function () {
  // Not using arrow function so we can use the 'this' keyword
  return `/catalog/style/${this._id}`;
});

module.exports = mongoose.model("Style", StyleSchema);
