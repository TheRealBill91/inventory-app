const Watch = require("../models/watch");
const Brand = require("../models/brand");
const Style = require("../models/style");
const WatchInstance = require("../models/watchinstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.all_styles = asyncHandler(async (req, res, next) => {
  const allStyles = await Style.find({}).sort({ name: 1 }).exec();
  res.render("style/style_list", {
    title: "All styles",
    all_styles: allStyles,
  });
});

exports.style_create_get = asyncHandler(async (req, res, next) => {
  res.render("style/style_form", { title: "Create style" });
});

exports.style_create_post = [
  body("name", "You must include a style name")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const style = new Style({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      res.render("brand/brand_form", {
        title: " Create style",
        style: style,
        errors: errors.array(),
      });
    } else {
      await style.save();
      res.redirect(style.url);
    }
  }),
];

exports.style_update_get = asyncHandler(async (req, res, next) => {
  res.send("page for updating watch style");
});

exports.style_update_post = asyncHandler(async (req, res, next) => {
  res.send("");
});

exports.style_delete_get = asyncHandler(async (req, res, next) => {
  res.send("page for deleting watch style");
});

exports.style_delete_post = asyncHandler(async (req, res, next) => {
  res.send("");
});

exports.style_details = asyncHandler(async (req, res, next) => {
  const [style_details, allWatchesByStyle] = await Promise.all([
    Style.findById(req.params.id).exec(),
    Watch.find({ style: req.params.id }).exec(),
  ]);

  if (style_details === null) {
    // No results
    const err = new Error("Style not found");
    err.status = 400;
    return next(err);
  }

  res.render("style/style_detail", {
    title: style_details.name,
    style_details: style_details,
    style_watches: allWatchesByStyle,
  });
});
