const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  postimage: {
    type: String,
    require: true,
  },

  description: {
    type: String,
    required: true,
  },

  startdate: {
    type: String,
    required: true,
  },
  enddate: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
