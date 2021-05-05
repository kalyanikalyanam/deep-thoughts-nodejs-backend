const express = require("express");
const mongoose = require("mongoose");
const PrivatePages = require("../models/privatepages");
const cors = require("cors");
const router = express.Router();

router.post("/Addprivatepage", (req, res) => {
  const postdata = new PrivatePages({
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

router.get("/privatepages", async (req, res) => {
  try {
    const postdata = await PrivatePages.find();

    res.status(200).json(postdata);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/update_privatepage/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const postdata = await PrivatePages.findById(id);

    res.status(200).json(postdata);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.put("/update_privatepage_patch/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatepost = { title, description, _id: id };

  await PrivatePages.findByIdAndUpdate(id, updatepost);

  res.json(updatepost);
});

router.delete("/delete_privatepage/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await PrivatePages.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
});
router.get("/privatepagetitles/:query", cors(), (req, res) => {
  var query = req.params.query;

  PrivatePages.find(
    {
      title: query,
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
