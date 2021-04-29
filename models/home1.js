const mongoose = require("mongoose");

const Home1Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  // video: {
  //   type: String,
  // },
});

const Home1 = mongoose.model("Home1", Home1Schema);

module.exports = Home1;
