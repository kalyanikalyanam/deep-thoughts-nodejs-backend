const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require("./routes/index");

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/admin", postRoutes);

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
