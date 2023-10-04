const path = require("path");
const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// handle Uncaught  Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception.");

    process.exit(1);
});

// setting config file:
dotenv.config({ path: "backend/config/config.env" });

// DB connection.
connectDB();

const server = app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`);
});

// Unhandle promise rejection.
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to Unhandled Promise Rejection.");

    server.close(() => {
        process.exit(1);
    });
});