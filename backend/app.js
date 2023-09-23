const express = require("express");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/error");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

// Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);

// use middlewares

app.use(errorMiddleware);


module.exports = app;   