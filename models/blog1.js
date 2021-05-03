const mongoose = require("mongoose");

const Blog1Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  date: {
    type: String,
  },

  description: {
    type: String,
    required: true,
  },
});

const Blog1 = mongoose.model("Blog1", Blog1Schema);

module.exports = Blog1;
