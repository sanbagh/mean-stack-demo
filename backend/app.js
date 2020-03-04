const path = require('path');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require('./routes/posts');
const userRoutes = require('./routes/user');
mongoose
  .connect(
    "mongodb+srv://sanjeev:"+ process.env.MONGO_ATLAS_PW +"@cluster0-7hcaz.mongodb.net/angular-node?retryWrites=true&w=majority"
  )
  .then(() => console.log("successfully conencted to database"))
  .catch((res) => console.log("error occured while connection to database"  + res));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use("/api/posts", routes);
app.use("/api/user", userRoutes);
module.exports = app;
