const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WatchInstanceSchema = new Schema({
  watch: { type: Schema.Types.ObjectId, ref: "Watch", required: true },
  serial_number: { type: String, required: true },
  purchase_date: { type: Date, default: Date.now },
});

// Virtual for watch instance's URL
WatchInstanceSchema.virtual("url").get(function () {
  // Not using arrow function so we can use the 'this' keyword
  return `/catalog/watchinstance/${this._id}`;
});

// Virtual for watchinstance formatted date
WatchInstanceSchema.virtual("purchase_date_formatted").get(function () {
  return DateTime.fromJSDate(this.purchase_date, {
    zone: "utc",
  }).toLocaleString(DateTime.DATE_MED);
});

// Virtual for loading in date into input field
WatchInstanceSchema.virtual("purchase_date_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.due_back, { zone: "utc" }).toISODate(); // format 'YYYY-MM-DD'
});

module.exports = mongoose.model("WatchInstance", WatchInstanceSchema);
