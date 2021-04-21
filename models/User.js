const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },

    phone: {
      type: String,
    },

    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const User1 = mongoose.model("User1", UserSchema);

module.exports = User1;
