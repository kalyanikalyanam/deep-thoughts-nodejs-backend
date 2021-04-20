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

  // image: {
  //   type: String,
  // },

  menu: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date(),
  },
});

const SubMenu = mongoose.model("SubMenu", SubMenuSchema);

module.exports = SubMenu;
