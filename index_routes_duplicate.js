const express = require("express");
const multer = require("multer");
const path = require("path");
const SubMenu = require("../models/sub_menu");

const {
  AddMenu,
  getMenus,
  getMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menu");

const router = express.Router();
var uploadimg = multer({
  storage: multer.diskStorage({
    destination: "/public/img",

    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".mp4" && ext !== ".png" && ext !== ".svg" && ext !== ".jpg") {
      return callback("Only images are allowed", null, false);
    }
    callback(null, true);
  },
});

//Menu
router.get("/menus", getMenus);
router.post("/add_menu", AddMenu);
router.get("/update_menu/:id", getMenu);
router.put("/update_menu_patch/:id", updateMenu);
router.delete("/delete_menu/:id", deleteMenu);

router.post("/add_sub_menu", uploadimg.any(), async (req, res) => {
  try {
    const newMenuMessage = await SubMenu.create({
      sub_menu: req.body.sub_menu,
      description: req.body.description,
      image: `http://localhost:5000/upload/${
        req.files[0] && req.files[0].filename ? req.files[0].filename : ""
      }`,
      menu: req.body.menu,
      date: Date.now(),
    });
    console.log(req.body);

    // newMenuMessage.save();

    res.status(201).json({ newMenuMessage });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
});

router.get("/submenus", async (req, res) => {
  try {
    const SubMenus = await SubMenu.find({});

    res.status(200).json({ SubMenus });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
