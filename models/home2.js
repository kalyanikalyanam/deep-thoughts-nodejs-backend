const mongoose = require("mongoose");

const Home2Schema = new mongoose.Schema({
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

const Home2 = mongoose.model("Home2", Home2Schema);

module.exports = Home2;
