const express = require("express");
const router = express.Router();

const watch_controller = require("../controllers/watchController");
const brand_controller = require("../controllers/brandController");
const style_controller = require("../controllers/styleController");
const watchinstance_controller = require("../controllers/watchInstanceController");

// WATCH ROUTES //

// Load home page
router.get("/", watch_controller.index);

// Load all watches page
router.get("/watches", watch_controller.all_watches);

// GET request for creating watch
router.get("/watch/create", watch_controller.watch_create_get);

// POST request for creating watch
router.post("/watch/create", watch_controller.watch_create_post);

// GET request for updating watch
router.get("/watch/:id/update", watch_controller.watch_update_get);

// POST request for updating watch
router.post("/watch/:id/update", watch_controller.watch_update_post);

// GET request to delete a watch
router.get("/watch/:id/delete", watch_controller.watch_delete_get);

// POST request for deleting watch
router.post("/watch/:id/delete", watch_controller.watch_delete_post);

// Load specific watch detail page
router.get("/watch/:id", watch_controller.watch_details);

// BRAND ROUTES //

// Load all watch brands
router.get("/brands", brand_controller.all_brands);

// GET request for creating a brand
router.get("/brand/create", brand_controller.brand_create_get);

// POST request for creating a brand
router.post("/brand/create", brand_controller.brand_create_post);

// GET request for updating watch brand
router.get("/brand/:id/update", brand_controller.brand_update_get);

// POST request for updating watch brand
router.post("/brand/:id/update", brand_controller.brand_update_post);

// GET request for deleting watch brand
router.get("/brand/:id/delete", brand_controller.brand_delete_get);

// POST request for deleting watch brand
router.post("/brand/:id/delete", brand_controller.brand_delete_post);

// Load specific brand detail page
router.get("/brand/:id", brand_controller.brand_details);

// STYLE ROUTES //

// Load all watch styles
router.get("/styles", style_controller.all_styles);

// GET request for creating a style
router.get("/style/create", style_controller.style_create_get);

// POST request for creating a style
router.post("/style/create", style_controller.style_create_post);

// GET request for updating a style
router.get("/style/:id/update", style_controller.style_update_get);

// POST request for updating a style
router.post("/style/:id/update", style_controller.style_update_post);

// GET request for deleting a style
router.get("/style/:id/delete", style_controller.style_delete_get);

// POST request for deleting a style
router.post("/style/:id/delete", style_controller.style_delete_post);

// GET request for getting specific watch style
router.get("/style/:id", style_controller.style_details);

// WATCH INSTANCE ROUTES

// Load all watch instances
router.get("/watchinstances", watchinstance_controller.all_watch_instances);

// GET request for creating a watch instance
router.get(
  "/watchinstance/create",
  watchinstance_controller.watchinstance_create_get
);

// POST request for creating a watch instance
router.post(
  "/watchinstance/create",
  watchinstance_controller.watchinstance_create_post
);

// GET request for updating a watch instance
router.get(
  "/watchinstance/:id/update",
  watchinstance_controller.watchinstance_update_get
);

// POST request for updating a watch instance
router.post(
  "/watchinstance/:id/update",
  watchinstance_controller.watchinstance_update_post
);

// GET request for deleting a watch instance
router.get(
  "/watchinstance/:id/delete",
  watchinstance_controller.watchinstance_delete_get
);

// POST request for deleting a watch instance
router.post(
  "/watchinstance/:id/delete",
  watchinstance_controller.watchinstance_delete_post
);

// GET request for getting a specific watch instance
router.get(
  "/watchinstance/:id",
  watchinstance_controller.watchinstance_details
);

module.exports = router;
