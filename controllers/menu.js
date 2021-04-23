const express = require("express");
const mongoose = require("mongoose");
const Menu = require("../models/menu");

// const router = express.Router();

const getMenus = async (req, res) => {
  try {
    const Menus = await Menu.find();

    res.status(200).json(Menus);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getMenu = async (req, res) => {
  const { id } = req.params;

  try {
    const Menu1 = await Menu.findById(id);

    res.status(200).json(Menu1);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const AddMenu = async (req, res) => {
  const { menu, description, date } = req.body;

  const newMenu = new Menu({
    menu,
    description,
    date,
  });

  try {
    await newMenu.save();

    res.status(201).json(newMenu);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { menu, description, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updateMenu = { menu, description, date, _id: id };

  await Menu.findByIdAndUpdate(id, updateMenu);

  res.json(updateMenu);
};

const deleteMenu = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await Menu.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

// export const likePost = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send(`No post with id: ${id}`);

//   const post = await Menu.findById(id);

//   const updatedMenu = await Menu.findByIdAndUpdate(
//     id,
//     { likeCount: post.likeCount + 1 },
//     { new: true }
//   );

//   res.json(updatedMenu);
// };

module.exports = {
  AddMenu,
  getMenus,
  updateMenu,
  getMenu,
  deleteMenu,
};
