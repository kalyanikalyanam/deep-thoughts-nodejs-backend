const mongoose = require("mongoose");

const BlogCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
});

const BlogCategory = mongoose.model("BlogCategory", BlogCategorySchema);

module.exports = BlogCategory;
