const mongoose = require("mongoose");

const About3Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },

  twitter: {
    type: String,
    required: true,
  },
  facebook: {
    type: String,
    required: true,
  },
  google: {
    type: String,
    required: true,
  },
});

const About3 = mongoose.model("About3", About3Schema);

module.exports = About3;
