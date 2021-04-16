const express = require("express");

const {
  AddMenu,
  getMenus,
  getMenu,
  updateMenu,
  deleteMenu,
  // getPost,

  // likePost,
  // deletePost,
} = require("../controllers/menu");

const router = express.Router();

router.get("/menus", getMenus);
router.post("/add_menu", AddMenu);
router.get("/update_menu/:id", getMenu);
router.put("/update_menu_patch/:id", updateMenu);
router.delete("/delete_menu/:id", deleteMenu);
// router.patch("/:id/likePost", likePost);
module.exports = router;
