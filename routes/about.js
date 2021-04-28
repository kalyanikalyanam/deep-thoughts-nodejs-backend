const express = require("express");
const mongoose = require("mongoose");

const About2 = require("../models/about2");
const path = require("path");
const router = express.Router();
const multer = require("multer");
var uploadimg = multer({
  storage: multer.diskStorage({
    destination: "./public/img/",

    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".svg" && ext !== ".jpg") {
      return callback("Only images are are allowed", null, false);
    }
    callback(null, true);
  },
});

///////About2

router.post("/AddAbout2", uploadimg.single("file"), (req, res) => {
  const about2data = new About2({
    title: req.body.title,

    description: req.body.description,
    image: `https://deepthoughts-nodejs.herokuapp.com/img/${req.file.filename}`,
  });

  console.log(req.body);

  about2data.save(function (err, vid) {
    if (err) {
      res.send(err);
    } else {
      res.status(201).send(vid);
    }
  });
});

router.get("/about2s", async (req, res) => {
  try {
    const about2data = await About2.find();

    res.status(200).json(about2data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/update_about2/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const about2data = await About2.findById(id);

    res.status(200).json(about2data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.put(
  "/update_about2_patch/:id",
  uploadimg.single("file"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body,
      image = `https://deepthoughts-nodejs.herokuapp.com/img/${req.file.filename}`;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id: ${id}`);

    const updateabout2 = { title, description, image, _id: id };

    await About2.findByIdAndUpdate(id, updateabout2);

    res.json(updateabout2);
  }
);

router.delete("/delete_about2/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await About2.findByIdAndRemove(id);

  res.json({ message: "about2 deleted successfully." });
});

module.exports = router;
