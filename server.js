const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require("./routes/index");
const homeRoutes = require("./routes/home");
const aboutRoutes = require("./routes/about");
const Post = require("./routes/post");
const Blog = require("./routes/blog");
const Auth = require("./routes/auth");
const upload = require("./routes/upload");
const path = require("path");
const app = express();
app.use("/public", express.static("public"));

app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());
app.use(express.static(__dirname + "/public/"));
app.use(express.static(path.join(__dirname, "/public")));
app.use("/file", upload);
app.use("/admin", postRoutes);
app.use("/home", homeRoutes);
app.use("/about", aboutRoutes);
app.use("/blog", Blog);

app.use("/", Post);
app.use("/api", Auth);

const CONNECTION_URL =
  "mongodb://kalyani:sushma1997@cluster0-shard-00-00.3oo3m.mongodb.net:27017,cluster0-shard-00-01.3oo3m.mongodb.net:27017,cluster0-shard-00-02.3oo3m.mongodb.net:27017/test?replicaSet=atlas-chwiy5-shard-0&ssl=true&authSource=admin";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);
