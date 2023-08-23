#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Brand = require("./models/brand");
const Style = require("./models/style");
const Watch = require("./models/watch");
const WatchInstance = require("./models/watchinstance");

const brands = [];
const styles = [];
const watches = [];
const watchinstances = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createBrands();
  await createStyles();
  await createWatches();
  await createWatchInstances();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// brand[0] will always be the [brandName] brand, regardless of the order
// in which the elements of promise.all's argument complete.
async function brandCreate(index, name) {
  const brand = new Brand({ name: name });
  await brand.save();
  brands[index] = brand;
  console.log(`Added brand: ${brand}`);
}

async function styleCreate(index, name) {
  const style = new Style({ name: name });
  await style.save();
  styles[index] = style;
  console.log(`Added style: ${style}`);
}

async function watchCreate(index, name, description, price, style, brand) {
  const watchdetail = {
    name: name,
    description: description,
    price: price,
    style: style,
    brand: brand,
  };

  const watch = new Watch(watchdetail);
  await watch.save();
  watches[index] = watch;
  console.log(`Added watch: ${name}`);
}

async function watchInstanceCreate(index, watch, serial_number, purchase_date) {
  const watchinstancedetail = {
    watch: watch,
    serial_number: serial_number,
    purchase_date: purchase_date,
  };
  if (purchase_date != false) watchinstancedetail.purchase_date = purchase_date;

  const watchinstance = new WatchInstance(watchinstancedetail);
  await watchinstance.save();
  watchinstances[index] = watchinstance;
  console.log(`Added watchinstance: ${serial_number}`);
}

async function createBrands() {
  console.log("Adding brands");
  await Promise.all([
    brandCreate(0, "Timeless Treasures"),
    brandCreate(1, "ChronoCraft"),
    brandCreate(2, "Prestige Pieces"),
  ]);
}

async function createStyles() {
  console.log("Adding styles");
  await Promise.all([
    styleCreate(0, "Dress"),
    styleCreate(1, "Field"),
    styleCreate(2, "Aviator"),
    styleCreate(3, "Dive"),
    styleCreate(4, "Racing"),
  ]);
}

async function createWatches() {
  console.log("Adding Watches");
  await Promise.all([
    watchCreate(
      0,
      "Elegant Explorer",
      "A sleek dress watch with a stainless steel case and black leather strap. Perfect for formal occasions.",
      250,
      styles[0],
      [brands[0]]
    ),
    watchCreate(
      1,
      "Rugged Ranger",
      "A durable field watch with a tough canvas strap and luminescent hands. Built to withstand the elements.",
      150,
      styles[1],
      [brands[1]]
    ),
    watchCreate(
      2,
      "Skybound Soarer",
      "An aviator watch with a large, easy-to-read dial and a brown leather strap. Designed for pilots and aviation enthusiasts.",
      300,
      styles[2],
      [brands[2]]
    ),
    watchCreate(
      3,
      "Deep Diver",
      "A dive watch with a water-resistant case and a rotating bezel for tracking dive times. Ideal for underwater adventures.",
      350,
      styles[3],
      [brands[0]]
    ),
    watchCreate(
      4,
      "Rapid Racer",
      "A racing watch with a chronograph function and a tachymeter scale for measuring speed. Perfect for motorsports enthusiasts.",
      400,
      styles[4],
      [brands[1]]
    ),
    watchCreate(
      5,
      "Timeless Classic",
      "A vintage-inspired dress watch with a gold-plated case and a brown leather strap. A timeless addition to any outfit. ",
      200,
      styles[0],
      [brands[2]]
    ),
    watchCreate(
      6,
      "Modern Minimalist",
      "A contemporary dress watch with a minimalist design and a stainless steel mesh strap. Simple yet sophisticated.",
      180,
      styles[0],
      [brands[0]]
    ),
  ]);
}

async function createWatchInstances() {
  console.log("Adding watch instances");
  await Promise.all([
    watchInstanceCreate(0, watches[0], "SN-001-ABCD", "2022-08-23"),
    watchInstanceCreate(1, watches[1], "SN-002-EFGH", "2022-04-02"),
    watchInstanceCreate(2, watches[2], "SN-003-IJKL", "2022-07-27"),
    watchInstanceCreate(3, watches[3], "SN-004-MNOP", "2022-02-04"),
    watchInstanceCreate(4, watches[4], "SN-005-QRST", "2022-11-29"),
    watchInstanceCreate(5, watches[4], "SN-006-UVWX", "2022-10-12"),
    watchInstanceCreate(6, watches[2], "SN-007-YZ12", "2022-06-20"),
    watchInstanceCreate(7, watches[6], "SN-008-3456", "2022-05-17"),
    watchInstanceCreate(8, watches[5], "SN-009-7890", "2022-08-14"),
    watchInstanceCreate(9, watches[3], "SN-010-AB12", "2022-09-03"),
    watchInstanceCreate(10, watches[5], "SN-011-CD34", "2022-01-07"),
  ]);
}
