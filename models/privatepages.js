const mongoose = require("mongoose");

const PrivatePagesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
});

const PrivatePages = mongoose.model("PrivatePages", PrivatePagesSchema);

module.exports = PrivatePages;
