const mongoose = require("mongoose");

const Home4Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Home4 = mongoose.model("Home4", Home4Schema);

module.exports = Home4;
