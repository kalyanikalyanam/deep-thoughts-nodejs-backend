const express = require("express");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const Blog1 = require("../models/blog1");
const BlogCategory = require("../models/blogcategories");
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

///  Blog 1

router.post("/AddBlog1", (req, res) => {
  const blog1data = new Blog1({
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
  });

  console.log(req.body);

  blog1data.save(function (err, vid) {
    if (err) {
      res.send(err);
    } else {
      res.status(201).send(vid);
    }
  });
});

router.get("/Blog1s", async (req, res) => {
  try {
    const blog1data = await Blog1.find();

    res.status(200).json(blog1data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/update_blog1/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blog1data = await Blog1.findById(id);

    res.status(200).json(blog1data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.put("/update_blog1_patch/:id", async (req, res) => {
  const { id } = req.params;
  const { title, category, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updateblog1 = { title, category, description, _id: id };

  await Blog1.findByIdAndUpdate(id, updateblog1);

  res.json(updateblog1);
});

router.delete("/delete_blog1/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await Blog1.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
});

////Blog categories

router.post("/AddBlogCategory", (req, res) => {
  const blog1data = new BlogCategory({
    category: req.body.category,
  });

  console.log(req.body);

  blog1data.save(function (err, vid) {
    if (err) {
      res.send(err);
    } else {
      res.status(201).send(vid);
    }
  });
});

router.get("/BlogCategorys", async (req, res) => {
  try {
    const blogcategorydata = await BlogCategory.find();

    res.status(200).json(blogcategorydata);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/update_blogcategory/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blogcategorydata = await BlogCategory.findById(id);

    res.status(200).json(blogcategorydata);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.put("/update_blogcategory_patch/:id", async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updateblogcategory = { category, _id: id };

  await BlogCategory.findByIdAndUpdate(id, updateblogcategory);

  res.json(updateblogcategory);
});

router.delete("/delete_blogcategory/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await BlogCategory.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
});
module.exports = router;
