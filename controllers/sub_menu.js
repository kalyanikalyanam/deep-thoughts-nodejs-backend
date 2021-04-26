const mongoose = require("mongoose");
const SubMenu = require("../models/sub_menu");

const getSubMenus = async (req, res) => {
  try {
    const submenudata = await SubMenu.find();

    res.status(200).json(submenudata);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getSubMenu = async (req, res) => {
  const { id } = req.params;

  try {
    const submenudata = await SubMenu.findById(id);

    res.status(200).json(submenudata);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// const AddSubMenu = (req, res) => {
//   const { submenu, description, description1, menu, date } = req.body;

//   const newSubMenuData = new SubMenu({
//     submenu,
//     description,
//     description1,
//     menu,
//     date,
//   });

//   try {
//     newSubMenuData.save();

//     res.status(201).json(newSubMenuData);
//   } catch (error) {
//     res.status(409).json({ message: error.message });
//   }
// };

// const updateSubMenu = async (req, res) => {
//   const { id } = req.params;
//   const { submenu, description, description1, menu, date } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send(`No post with id: ${id}`);

//   const updateSubMenuData = {
//     submenu,
//     description,
//     description1,
//     menu,
//     date,
//     _id: id,
//   };

//   await SubMenu.findByIdAndUpdate(id, updateSubMenuData);

//   res.json(updateSubMenuData);
// };

const deleteSubMenu = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await SubMenu.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

module.exports = {
  // AddSubMenu,
  getSubMenus,
  // updateSubMenu,
  getSubMenu,
  deleteSubMenu,
};
