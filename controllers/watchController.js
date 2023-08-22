const Watch = require("../models/watch");
const Brand = require("../models/brand");
const Style = require("../models/style");
const WatchInstance = require("../models/watchinstance");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [
    watchDocuments,
    brandDocuments,
    styleDocuments,
    watchInstanceDocuments,
  ] = await Promise.all([
    Watch.countDocuments({}).exec(),
    Brand.countDocuments({}).exec(),
    Style.countDocuments({}).exec(),
    WatchInstance.countDocuments({}).exec(),
  ]);

  res.render("home_page", {
    title: "Watch Inventory Home",
    watch_count: watchDocuments,
    brand_count: brandDocuments,
    style_count: styleDocuments,
    watch_instance_count: watchInstanceDocuments,
  });
});

exports.all_watches = asyncHandler(async (req, res, next) => {
  const allWatches = await Watch.find({}, "name price")
    .sort({ name: 1 })
    .exec();
  res.render("watch/watch_list", {
    title: "Watch List",
    all_watches: allWatches,
  });
});

exports.watch_create_get = asyncHandler(async (req, res, next) => {
  res.send("page for creating watches");
});

exports.watch_create_post = asyncHandler(async (req, res, next) => {
  res.send("page for creating watches");
});

exports.watch_update_get = asyncHandler(async (req, res, next) => {
  res.send("page for updating watches");
});

exports.watch_update_post = asyncHandler(async (req, res, next) => {
  res.send("page for updating watches");
});

exports.watch_delete_get = asyncHandler(async (req, res, next) => {
  res.send("page for deleting watches");
});

exports.watch_delete_post = asyncHandler(async (req, res, next) => {
  res.send("page for deleting watches");
});

exports.watch_details = asyncHandler(async (req, res, next) => {
  const [watch_details, watch_instances] = await Promise.all([
    Watch.findById(req.params.id).populate("brand").populate("style").exec(),
    WatchInstance.find({
      watch: req.params.id,
    })
      .populate("watch")
      .exec(),
  ]);

  res.render("watch/watch_detail", {
    title: watch_details.name,
    watch: watch_details,
    watch_instances: watch_instances,
  });
});

// Will need this at some point for one of the routes
/* if (Array.isArray(watchDetails.style)) {
  watchDetails.style = [];
} */
