const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

// Route imports
const products = require("./routes/productRoute");

app.use("/api/v1", products);


module.exports = app;   