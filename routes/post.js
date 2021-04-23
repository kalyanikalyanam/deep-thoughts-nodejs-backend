const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/post");
const cors = require("cors");
const router = express.Router();

router.post("/Addpost", (req, res) => {
  const postdata = new Post({
    title: req.body.title,
    description: req.body.description,
    menu: req.body.menu,
    submenu: req.body.submenu,
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
  const { title, description, menu, submenu } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatepost = { title, description, menu, submenu, _id: id };

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
router.get("/postvalues/:query", cors(), (req, res) => {
  var query = req.params.query;

  Post.find(
    {
      submenu: query,
    },
    (err, result) => {
      if (err) throw err;
      if (result) {
        res.json(result);
      } else {
        res.send(
          JSON.stringify({
            error: "Error",
          })
        );
      }
    }
  );
});
router.get("/postvalueswithmenu/:query", cors(), (req, res) => {
  var query = req.params.query;

  Post.find(
    {
      menu: query,
    },
    (err, result) => {
      if (err) throw err;
      if (result) {
        res.json(result);
      } else {
        res.send(
          JSON.stringify({
            error: "Error",
          })
        );
      }
    }
  );
});

module.exports = router;
