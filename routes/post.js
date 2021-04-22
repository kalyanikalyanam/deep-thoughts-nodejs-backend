const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/post");
const router = express.Router();

router.post("/Addpost", (req, res) => {
  const postdata = new Post({
    title: req.body.title,
    description: req.body.description,
  });

  console.log(req.body);

  postdata.save(function (err, vid) {
    if (err) {
      res.send(err);
    } else {
      res.status(201).send(vid);
    }
  });
});

router.get("/Posts", async (req, res) => {
  try {
    const postdata = await Post.find();

    res.status(200).json(postdata);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/update_post/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const postdata = await Post.findById(id);

    res.status(200).json(postdata);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.put("/update_post_patch/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatepost = { title, description, _id: id };

  await Post.findByIdAndUpdate(id, updatepost);

  res.json(updatepost);
});

router.delete("/delete_post/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await Post.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
});

module.exports = router;
