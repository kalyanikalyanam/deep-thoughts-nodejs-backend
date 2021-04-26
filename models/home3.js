const mongoose = require("mongoose");

const Home3Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
});

const Home3 = mongoose.model("Home3", Home3Schema);

module.exports = Home3;
