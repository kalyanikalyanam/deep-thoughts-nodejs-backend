const mongoose = require("mongoose");

const About4Schema = new mongoose.Schema({
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
  },
});

const About2 = mongoose.model("About2", About4Schema);

module.exports = About2;
