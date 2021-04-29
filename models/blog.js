const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
