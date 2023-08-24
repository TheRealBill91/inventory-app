const Watch = require("../models/watch");
const Brand = require("../models/brand");
const Style = require("../models/style");
const WatchInstance = require("../models/watchinstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.all_watch_instances = asyncHandler(async (req, res, next) => {
  const allWatchInstances = await WatchInstance.find({})
    .populate({
      path: "watch",
      select: "name",
      options: { sort: { name: 1 } },
    })
    .exec();

  res.render("watchinstance/watchinstance_list", {
    title: "Watch Stock",
    watchinstance_list: allWatchInstances,
  });
});

exports.watchinstance_create_get = asyncHandler(async (req, res, next) => {
  const allWatches = await Watch.find().exec();

  res.render("watchinstance/watchinstance_form", {
    title: "Create watch entry",
    watch_list: allWatches,
  });
});

exports.watchinstance_create_post = [
  // Validate and sanitize fields.
  body("watch", "Watch must be specified").trim().isLength({ min: 1 }).escape(),
  body("serial_number", "Serial Number must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("purchase_date", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a WatchInstance object with escaped and trimmed data.
    const watchInstance = new WatchInstance({
      watch: req.body.watch,
      serial_number: req.body.serial_number,
      purchase_date: req.body.purchase_date,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allWatches = await Watch.find({}, "name").exec();

      res.render("watchinstance/watchinstance_form", {
        title: "Create watch entry",
        watch_list: allWatches,
        selected_watch: watchInstance.watch._id,
        errors: errors.array(),
        watchinstance: watchInstance,
      });
      return;
    } else {
      // Data from form is valid
      await watchInstance.save();
      res.redirect(watchInstance.url);
    }
  }),
];

exports.watchinstance_update_get = asyncHandler(async (req, res, next) => {
 
});

exports.watchinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("");
});

exports.watchinstance_delete_get = asyncHandler(async (req, res, next) => {
  const watchInstance = await WatchInstance.findById(req.params.id)
    .populate("watch")
    .exec();

  if (watchInstance === null) {
    res.redirect("/catalog/watchInstances");
  }

  res.render("watchinstance/watchinstance_delete", {
    title: "Delete watch entry",
    watch_instance: watchInstance,
  });
});

exports.watchinstance_delete_post = asyncHandler(async (req, res, next) => {
  await WatchInstance.findByIdAndDelete(req.body.watchinstanceid).exec();
  res.redirect("/catalog/watchinstances");
});

exports.watchinstance_details = asyncHandler(async (req, res, next) => {
  const watchinstance_details = await WatchInstance.findById(req.params.id)
    .populate({
      path: "watch",
      select: "name",
    })
    .exec();

  if (watchinstance_details === null) {
    // No results
    const err = new Error("Watch instance not found");
    err.status = 400;
    return next(err);
  }

  res.render("watchinstance/watchinstance_detail", {
    title: watchinstance_details.serial_number,
    watchinstance_details: watchinstance_details,
  });
});
