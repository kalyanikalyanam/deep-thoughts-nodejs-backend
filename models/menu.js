const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  menu: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date(),
  },
});

const Menu = mongoose.model("Menu", MenuSchema);

module.exports = Menu;
