const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/post");
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
    if (ext !== ".mp4" && ext !== ".png" && ext !== ".svg" && ext !== ".jpg") {
      return callback("Only videos are allowed", null, false);
    }
    callback(null, true);
  },
});

router.post("/Addpost", uploadimg.single("file"), (req, res) => {
  const postdata = new Post({
    title: req.body.title,
    postimage: `https://deepthoughts-nodejs.herokuapp.com/upload/${req.file.filename}`,
    description: req.body.description,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
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
router.delete("/delete_post", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await Post.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
});

// router.patch("/editpost/:id", uploadimg.any(), (req, res) => {
//   let postdata = {};

//   postdata.title = req.body.title;
//   postdata.description = req.body.description;
//   postdata.postimage = `https://localhost:5000/upload/upload/${
//     req.files[0] && req.files[0].filename ? req.files[0].filename : ""
//   }`;
//   postdata.startdate = req.body.startdate;
//   postdata.enddate = req.body.enddate;

//   let query = {
//     _id: req.params.id,
//   };

//   Post.update(query, postdata, (err) => {
//     if (!err) {
//       req.flash("success_msg", "grade is added");
//       res.status(200).send(postdata);
//       // res.redirect('/admin/banner');
//     } else {
//       errors.push({
//         msg: "failed",
//       });
//     }
//   });
// });

module.exports = router;
