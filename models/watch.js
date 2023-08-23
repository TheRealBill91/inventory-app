const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WatchSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // number_in_stock: { type: Number },
  price: { type: Number, required: true },
  style: { type: Schema.Types.ObjectId, ref: "Style", required: true },
  brand: [{ type: Schema.Types.ObjectId, ref: "Brand", required: true }],
});

// Virtual for watch's URL
WatchSchema.virtual("url").get(function () {
  // Not using arrow function so we can use the 'this' keyword
  return `/catalog/watch/${this._id}`;
});

module.exports = mongoose.model("Watch", WatchSchema);
