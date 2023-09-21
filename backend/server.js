const path = require("path");
const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// setting config file:
dotenv.config({ path: "backend/config/config.env" });

// connecting DB:
connectDB();

app.listen(process.env.PORT, () => {

    console.log(`server is running on http://localhost:${process.env.PORT}`);
});