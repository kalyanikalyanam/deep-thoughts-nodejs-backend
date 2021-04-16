const express = require("express");
const mongoose = require("mongoose");
const PostMessage = require("../models/menu");

const router = express.Router();

const getMenus = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getMenu = async (req, res) => {
  const { id } = req.params;

  try {
    const Menu = await PostMessage.findById(id);

    res.status(200).json(Menu);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const AddMenu = async (req, res) => {
  const { menu, date } = req.body;

  const newPostMessage = new PostMessage({
    menu,
    date,
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { menu, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updateMenu = { menu, date, _id: id };

  await PostMessage.findByIdAndUpdate(id, updateMenu);

  res.json(updateMenu);
};

const deleteMenu = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

// export const likePost = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send(`No post with id: ${id}`);

//   const post = await PostMessage.findById(id);

//   const updatedPost = await PostMessage.findByIdAndUpdate(
//     id,
//     { likeCount: post.likeCount + 1 },
//     { new: true }
//   );

//   res.json(updatedPost);
// };

module.exports = {
  AddMenu,
  getMenus,
  updateMenu,
  getMenu,
  deleteMenu,
};
