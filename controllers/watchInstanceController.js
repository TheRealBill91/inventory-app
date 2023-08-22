const Watch = require("../models/watch");
const Brand = require("../models/brand");
const Style = require("../models/style");
const WatchInstance = require("../models/watchinstance");
const asyncHandler = require("express-async-handler");

exports.all_watch_instances = asyncHandler(async (req, res, next) => {
  res.send("page for viewing all watch instances");
});

exports.watchinstance_create_get = asyncHandler(async (req, res, next) => {
  res.send("page for creating watch instance");
});

exports.watchinstance_create_post = asyncHandler(async (req, res, next) => {
  res.send("");
});

exports.watchinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("page for updating watch instance");
});

exports.watchinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("");
});

exports.watchinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("page for deleting watch instance");
});

exports.watchinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("page for deleting watch instance");
});

exports.watchinstance_details = asyncHandler(async (req, res, next) => {
  res.send("page for viewing watch instance details");
});
