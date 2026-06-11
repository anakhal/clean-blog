require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Category = require("../models/Category");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clean-blog-database";

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);

    let bacSM = await Category.findOne({ name: "BacSM" });
    if (!bacSM) {
      bacSM = new Category({ name: "BacSM" });
      await bacSM.save();
      console.log("Created BacSM category");
    } else {
      console.log("BacSM already exists");
    }

    const algebre = await Category.findOne({ name: "Algèbre" });
    if (algebre) {
      algebre.parent = bacSM._id;
      await algebre.save();
      console.log("Updated Algèbre parent to BacSM");
    }

    const analyse = await Category.findOne({ name: "Analyse" });
    if (analyse) {
      analyse.parent = bacSM._id;
      await analyse.save();
      console.log("Updated Analyse parent to BacSM");
    }

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}

run();
