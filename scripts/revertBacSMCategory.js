require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Category = require("../models/Category");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clean-blog-database";

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const algebre = await Category.findOne({ name: "Algèbre" });
    if (algebre) {
      algebre.parent = null;
      await algebre.save();
      console.log("Reverted Algèbre parent to null");
    }

    const analyse = await Category.findOne({ name: "Analyse" });
    if (analyse) {
      analyse.parent = null;
      await analyse.save();
      console.log("Reverted Analyse parent to null");
    }

    const bacSM = await Category.findOne({ name: "BacSM" });
    if (bacSM) {
      await Category.deleteOne({ _id: bacSM._id });
      console.log("Deleted BacSM category");
    } else {
      console.log("BacSM category not found");
    }

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}

run();
