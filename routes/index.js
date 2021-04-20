const express = require("express");

// const upload = require("../middleware/upload");

const SubMenu = require("../models/sub_menu");

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

//Sub Menu
router.get("/submenus", getSubMenus);

// router.post("/add_sub_menu", upload.single("upload"), (req, res) => {
//   var img = req.file.path;
//   const url = "https://" + req.headers.host + "/" + img;
//   console.log(img.split("\\")[2]);
//   const { submenu, description, menu, date } = req.body;

//   const newSubMenuData = new SubMenu({
//     submenu,
//     description,
//     image: url,
//     menu,
//     date,
//   });
//   console.log(req.file);

//   try {
//     newSubMenuData.save();

//     res.status(201).json(newSubMenuData);
//   } catch (error) {
//     res.status(409).json({ message: error.message });
//   }
// });
router.post("/add_sub_menu", AddSubMenu);
router.get("/update_sub_menu/:id", getSubMenu);
router.put("/update_sub_menu_patch/:id", updateSubMenu);
router.delete("/delete_sub_menu/:id", deleteSubMenu);

// router.post("/add_sub_menu", uploadimg.any(), async (req, res) => {
//   const newSubMenu = new SubMenu({
//     sub_menu: req.body.sub_menu,
//     description: req.body.description,
//     image: `http://localhost:5000/upload/${
//       req.files[0] && req.files[0].filename ? req.files[0].filename : ""
//     }`,
//     menu: req.body.menu,
//     date: Date.now(),
//   });

//   try {
//     await newSubMenu.save();

//     res.status(201).json(newSubMenu);
//   } catch (error) {
//     res.status(409).json({ message: error.message });
//   }
// });

// router.post(
//   "/add_sub_menu",

//   uploadimg.any(),
//   (req, res) => {
//     const submenudata = new SubMenu({
//       submenu: req.body.submenu,
//       description: req.body.description,
//       image: `http://localhost:5000/upload/${
//         req.files[0] && req.files[0].filename ? req.files[0].filename : ""
//       }`,
//       menu: req.body.menu,
//       date: Date.now(),
//     });

//     submenudata.save(function (err, vid) {
//       if (err) {
//         res.json(200)(err);
//       } else {
//       }
//     });
//   }
// );
// router.post("/add_sub_menu", uploadimg.any(), async (req, res) => {
//   try {
//     const newMenuMessage = await SubMenu.create({
//       submenu: req.body.submenu,
//       description: req.body.description,
//       image: `http://localhost:5000/upload/${
//         req.files[0] && req.files[0].filename ? req.files[0].filename : ""
//       }`,
//       menu: req.body.menu,
//       date: Date.now(),
//     });
//     console.log(req.body);

//     // newMenuMessage.save();

//     res.status(201).json({ newMenuMessage });
//   } catch (error) {
//     console.log(error);
//     res.status(409).json({ message: error.message });
//   }
// });

// router.get("/submenus", uploadimg.any(), async (req, res) => {
//   try {
//     const SubMenus = await SubMenu.find({});

//     res.status(200).json(SubMenus);
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: error.message });
//   }
// });

// router.get("/update_sub_menu/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const SubMenu = await SubMenu.findById(id);

//     res.status(200).json({ SubMenu });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// });
// router.put("/update_sub_menu_patch/:id", async (req, res) => {
//   const { id } = req.params;
//   const { submenu, description, image, menu, date } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send(`No post with id: ${id}`);

//   const updateSubMenu = { submenu, description, image, menu, date, _id: id };

//   await Menu.findByIdAndUpdate(id, updateSubMenu);

//   res.json(updateSubMenu);
// });

module.exports = router;
