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
  body("brandid", "You must include a brand name")
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
  const brand = await Brand.findById(req.params.id).exec();

  if (brand === null) {
    const err = new Error("brand not found");
    err.status = 404;
    return next(err);
  }

  res.render("brand/brand_form", {
    title: "Update brand",
    brand: brand,
  });
});

exports.brand_update_post = [
  body("brandid", "You must enter a brand name")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const brand = new Brand({
      name: req.body.brandid,
      id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("brand/brand_form", {
        title: "Update brand",
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedBrand = await Brand.findByIdAndUpdate(
        req.params.id,
        brand,
        {}
      );
      res.redirect(updatedBrand.url);
    }
  }),
];

exports.brand_delete_get = asyncHandler(async (req, res, next) => {
  const [brand, allBrandWatches] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Watch.find({ brand: req.params.id }, "name description").exec(),
  ]);

  if (brand === null) {
    res.redirect("/catalog/brands");
  }

  res.render("brand/brand_delete", {
    title: brand.name,
    brand: brand,
    brand_watches: allBrandWatches,
  });
});

exports.brand_delete_post = asyncHandler(async (req, res, next) => {
  const [brand, allBrandWatches] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Watch.find({ brand: req.params.id }, "name description").exec(),
  ]);

  if (allBrandWatches.length > 0) {
    res.render("brand/brand_delete", {
      title: brand.name,
      brand: brand,
      brand_watches: allBrandWatches,
    });
    return;
  } else {
    await Brand.findByIdAndRemove(req.body.brandid);
    res.redirect("/catalog/brands");
  }
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
    brand: brand_details,
    brand_watches: allWatchesByBrand,
  });
});
