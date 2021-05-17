const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const SubMenu = require("../models/sub_menu");
const User = require("../models/login");
const Menu = require("../models/menu");
const path = require("path");
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
      return callback("Only images are allowed", null, false);
    }
    callback(null, true);
  },
});
const {
  AddMenu,
  getMenus,
  getMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menu");

const {
  AddSubMenu,
  getSubMenus,
  updateSubMenu,
  getSubMenu,
  deleteSubMenu,
} = require("../controllers/sub_menu");

const router = express.Router();

//Menu
router.get("/menus", getMenus);
router.post("/add_menu", AddMenu);
router.get("/update_menu/:id", getMenu);
router.put("/update_menu_patch/:id", updateMenu);
router.delete("/delete_menu/:id", deleteMenu);

router.get("/getmenudescription/:menu", cors(), async (req, res) => {
  var menu = req.params;
  try {
    const Menu1 = await Menu.findOne(menu);

    res.status(200).json(Menu1);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Sub Menu
router.get("/submenus", getSubMenus);
// router.post("/add_sub_menu", AddSubMenu);

router.post("/add_sub_menu", uploadimg.single("file"), (req, res) => {
  const newSubMenuData = new SubMenu({
    submenu: req.body.submenu,
    description: req.body.description,
    description1: req.body.description1,
    menu: req.body.menu,
    image: `https://deepthought.education:5055/img/${req.file.filename}`,
  });

  console.log(req.body);

  newSubMenuData.save(function (err, vid) {
    if (err) {
      res.send(err);
    } else {
      res.status(201).send(vid);
    }
  });
});

router.get("/update_sub_menu/:id", getSubMenu);
// router.put("/update_sub_menu_patch/:id", updateSubMenu);

router.put(
  "/update_sub_menu_patch/:id",
  uploadimg.single("file"),
  async (req, res) => {
    const { id } = req.params;
    const { submenu, description, description1, menu } = req.body,
      image = `https://deepthought.education:5055/img/${req.file.filename}`;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id: ${id}`);

    const updateSubMenuData = {
      submenu,
      description,
      description1,
      menu,
      image,
      _id: id,
    };

    await SubMenu.findByIdAndUpdate(id, updateSubMenuData);

    res.json(updateSubMenuData);
  }
);

// router.patch(
//   "/update_sub_menu_patch/:id",
//   uploadimg.single("file"),
//   (req, res) => {
//     let bannerdata = {};
//     // submenu,
//     //       description,
//     //       description1,
//     //       menu,
//     //       image,
//     bannerdata.submenu = req.body.submenu;

//     bannerdata.description = req.body.description;
//     bannerdata.description1 = req.body.description1;
//     bannerdata.menu = req.body.menu;
//     bannerdata.image = `https://deepthought.education:5055/img/${req.file.filename}`;

//     let query = {
//       _id: req.params.id,
//     };

//     SubMenu.update(query, bannerdata, (err) => {
//       if (!err) {
//         req.flash("success_msg", "grade is added");
//         res.status(200).send(bannerdata);
//         // res.redirect('/admin/banner');
//       } else {
//         errors.push({
//           msg: "failed",
//         });
//       }
//     });
//   }
// );
router.delete("/delete_sub_menu/:id", deleteSubMenu);
router.get("/submenuvalues/:query", cors(), (req, res) => {
  var query = req.params.query;

  SubMenu.find(
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

router.get("/getsubmenudescription/:submenu", cors(), async (req, res) => {
  var submenu = req.params;
  try {
    const submenu1 = await SubMenu.findOne(submenu);

    res.status(200).json(submenu1);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Register
router.post("/users", async (req, res) => {
  //to create a req.

  const value = new User(req.body);
  try {
    await value.save();
    const token = value.generateAuthToken();
    res.status(201).send({ value, token });
  } catch (e) {
    res.status(500).send(e);
  }
});
//to login a user
router.post("/users/login", async (req, res) => {
  try {
    console.log("dwdwwd");
    const user = await User.findBylogin(req.body.email, req.body.password);
    console.log(user);
    const token = await user.generateAuthToken(); //this method generates a token for login users
    res.json({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});
//logout
router.get("/logout", auth, (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    req.user.save();
    res.send("logout successful");
  } catch (e) {
    res.status(401).send(e);
  }
});
//changepassword
router.post("/changepassword", auth, function (req, res) {
  const { password, passwordnew } = req.body;

  console.log(req.user);
  console.log(req.user._id + "id");

  User.findById(req.user._id, (err, data) => {
    if (err) {
      console.log(err);
    }
    bcrypt.compare(password, data.password, (err, isMatch) => {
      if (err) {
        res.send(err);
      }
      if (!isMatch) {
        // res.send({
        //   Error: "Password is Incorrect",
        // });
        console.log("not match");
      }
      data.password = passwordnew;
      console.log(data.password);

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(data.password, salt, (err, hash) => {
          if (err) throw err;

          data.password = hash;

          data.save(function (err, Person) {
            if (err) console.log(err);
            else console.log("Success");
            res.send(Person);
          });
        });
      });
    });
  });
});

module.exports = router;
