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
  },

  twitter: {
    type: String,
  },
  facebook: {
    type: String,
  },
  google: {
    type: String,
  },
});

const About3 = mongoose.model("About3", About3Schema);

module.exports = About3;
