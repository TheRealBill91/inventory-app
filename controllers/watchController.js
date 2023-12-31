const Watch = require("../models/watch");
const Brand = require("../models/brand");
const Style = require("../models/style");
const WatchInstance = require("../models/watchinstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  const [allStyles, allBrands] = await Promise.all([
    Style.find().exec(),
    Brand.find().exec(),
  ]);

  console.log(allBrands);

  res.render("watch/watch_form", {
    title: "Create watch",
    styles: allStyles,
    brands: allBrands,
  });
});

exports.watch_create_post = [
  // Convert the brand to an array.
  (req, res, next) => {
    if (!(req.body.brand instanceof Array)) {
      if (typeof req.body.brand === "undefined") req.body.brand = [];
      else req.body.brand = new Array(req.body.brand);
    }
    next();
  },

  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .isCurrency()
    .escape(),
  body("style", "You must pick a style").trim().isLength({ min: 1 }).escape(),
  body("brand").isArray({ min: 1 }).withMessage("Must select a brand").escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a new watch object
    const watch = new Watch({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      style: req.body.style,
      brand: req.body.brand,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all styles and brands for form.
      const [allStyles, allBrands] = await Promise.all([
        Style.find().exec(),
        Brand.find().exec(),
      ]);

      // Mark our selected brands as checked
      for (const brand of allBrands) {
        if (watch.brand.includes(brand._id)) {
          brand.checked = "true";
        }
      }

      res.render("watch/watch_form", {
        title: "Create watch",
        watch: watch,
        selected_style: watch.style._id,
        styles: allStyles,
        brands: allBrands,
        errors: errors.array(),
      });
    } else {
      // Data from watch is valid
      await watch.save();
      res.redirect(watch.url);
    }
  }),
];

exports.watch_update_get = asyncHandler(async (req, res, next) => {
  const [watch, allStyles, allBrands] = await Promise.all([
    Watch.findById(req.params.id).exec(),
    Style.find().exec(),
    Brand.find().exec(),
  ]);

  if (watch === null) {
    const err = new Error("No watch found");
    err.status = 404;
    return next(err);
  }

  // Mark our selected brands as checked
  for (const brand of allBrands) {
    for (const watch_b of watch.brand) {
      if (brand._id.toString() === watch_b._id.toString()) {
        brand.checked = "true";
      }
    }
  }

  res.render("watch/watch_form", {
    title: "Update watch",
    styles: allStyles,
    brands: allBrands,
    selected_style: watch.style._id,
    watch: watch,
  });
});

exports.watch_update_post = [
  // Convert the brand to an array.
  (req, res, next) => {
    if (!(req.body.brand instanceof Array)) {
      if (typeof req.body.brand === "undefined") req.body.brand = [];
      else req.body.brand = new Array(req.body.brand);
    }
    next();
  },

  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .isCurrency()
    .escape(),
  body("style", "You must pick a style").trim().isLength({ min: 1 }).escape(),
  body("brand").isArray({ min: 1 }).withMessage("Must select a brand").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const [allBrands, allStyles] = await Promise.all([
      Brand.find().exec(),
      Style.find().exec(),
    ]);

    const watch = new Watch({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      style: req.body.style,
      brand: req.body.brand,
      id: req.params.id,
    });

    if (!errors.isEmpty) {
      res.render("watch/watch_form", {
        title: "Update watch",
        brands: allBrands,
        styles: allStyles,
        selected_style: watch.style._id,
        errors: errors.array(),
      });
    } else {
      const updatedWatch = await Watch.findByIdAndUpdate(
        req.params.id,
        watch,
        {}
      );
      res.redirect(updatedWatch.url);
    }
  }),
];

exports.watch_delete_get = asyncHandler(async (req, res, next) => {
  const [watch, associatedWatchInstances] = await Promise.all([
    Watch.findById(req.params.id).exec(),
    WatchInstance.find({ watch: req.params.id }).populate("watch").exec(),
  ]);

  if (watch === null) {
    res.redirect("/catalog/watches");
  }

  res.render("watch/watch_delete", {
    title: watch.name,
    watch: watch,
    watch_instances: associatedWatchInstances,
  });
});

exports.watch_delete_post = asyncHandler(async (req, res, next) => {
  const [watch, associatedWatchInstances] = await Promise.all([
    Watch.findById(req.params.id).exec(),
    WatchInstance.find({ watch: req.params.id }).populate("watch").exec(),
  ]);

  if (associatedWatchInstances.length > 0) {
    res.render("watch/watch_delete", {
      title: watch.name,
      watch: watch,
      watch_instances: associatedWatchInstances,
    });
    return;
  } else {
    await Watch.findByIdAndRemove(req.body.watchid);
    res.redirect("/catalog/watches");
  }
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

  if (watch_details === null) {
    // No results
    const err = new Error("Watch not found");
    err.status = 400;
    return next(err);
  }

  res.render("watch/watch_detail", {
    title: watch_details.name,
    watch: watch_details,
    watch_instances: watch_instances,
  });
});
