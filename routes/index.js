const express = require("express");
const cors = require("cors");
const auth = require("../middleware/auth");
const SubMenu = require("../models/sub_menu");
const User = require("../models/login");
const Menu = require("../models/menu");
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

router.get("/getmenudescription/:query", cors(), async (req, res) => {
  var query = req.params.query;
  try {
    const Menu1 = await Menu.find({ menu: query });

    res.status(200).json(Menu1);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
//   Menu.find(
//     {
//       menu: query,
//     },
//     (err, result) => {
//       if (err) throw err;
//       if (result) {
//         res.json(result);
//       } else {
//         res.send(
//           JSON.stringify({
//             error: "Error",
//           })
//         );
//       }
//     }
//   );
// });

//Sub Menu
router.get("/submenus", getSubMenus);
router.post("/add_sub_menu", AddSubMenu);
router.get("/update_sub_menu/:id", getSubMenu);
router.put("/update_sub_menu_patch/:id", updateSubMenu);
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
