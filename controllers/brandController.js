const Watch = require("../models/watch");
const Brand = require("../models/brand");
const Style = require("../models/style");
const WatchInstance = require("../models/watchinstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.all_brands = asyncHandler(async (req, res, next) => {
  const allBrands = await Brand.find({}).sort({ name: 1 }).exec();
  res.render("brand/brand_list", {
    title: "All brands",
    all_brands: allBrands,
  });
});

exports.brand_create_get = asyncHandler(async (req, res, next) => {
  res.render("brand/brand_form", {
    title: "Create brand",
  });
});

exports.brand_create_post = [
  body("name", "You must include a brand name")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const brand = new Brand({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      res.render("brand/brand_form", {
        title: " Create brand",
        brand: brand,
        errors: errors.array(),
      });
    } else {
      await brand.save();
      res.redirect(brand.url);
    }
  }),
];

exports.brand_update_get = asyncHandler(async (req, res, next) => {
  res.send("page for updating brand get request");
});

exports.brand_update_post = asyncHandler(async (req, res, next) => {
  res.send("");
});

exports.brand_delete_get = asyncHandler(async (req, res, next) => {
  res.send("page for deleting brand get request");
});

exports.brand_delete_post = asyncHandler(async (req, res, next) => {
  res.send("");
});

exports.brand_details = asyncHandler(async (req, res, next) => {
  const [brand_details, allWatchesByBrand] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Watch.find({ brand: req.params.id }).exec(),
  ]);

  if (brand_details === null) {
    // No results
    const err = new Error("Brand not found");
    err.status = 400;
    return next(err);
  }

  res.render("brand/brand_detail", {
    title: brand_details.name,
    brand_details: brand_details,
    brand_watches: allWatchesByBrand,
  });
  res.send("page for displaying watch brand details");
});
