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

  date: {
    type: Date,
    default: Date(),
  },
  image: {
    type: String,
    required: true,
  },
});

const SubMenu = mongoose.model("SubMenu", SubMenuSchema);

module.exports = SubMenu;
