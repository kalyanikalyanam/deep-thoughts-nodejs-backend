const express = require("express");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const cors = require("cors");
const router = express.Router();

router.post("/AddBlog", (req, res) => {
  const blogdata = new Blog({
    url: req.body.url,
  });

  console.log(req.body);

  blogdata.save(function (err, vid) {
    if (err) {
      res.send(err);
    } else {
      res.status(201).send(vid);
    }
  });
});

router.get("/update_blog/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blogdata = await Blog.findById(id);

    res.status(200).json(blogdata);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.put("/update_blog_patch/:id", async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updateblog = { url, _id: id };

  await Blog.findByIdAndUpdate(id, updateblog);

  res.json(updateblog);
});

module.exports = router;
