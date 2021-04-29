const mongoose = require("mongoose");

const SubMenuSchema = new mongoose.Schema({
  submenu: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  description1: {
    type: String,
    required: true,
  },

  menu: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },
});

const SubMenu = mongoose.model("SubMenu", SubMenuSchema);

module.exports = SubMenu;
