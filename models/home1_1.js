const mongoose = require("mongoose");

const Home1_1Schema = new mongoose.Schema({
  video: {
    type: String,
  },
});

const Home1_1 = mongoose.model("Home1_1", Home1_1Schema);

module.exports = Home1_1;
