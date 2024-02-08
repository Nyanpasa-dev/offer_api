// const cookieParser = require("cookie-parser");
// const listEndpoints = require("express-list-endpoints");

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const logger = require("morgan");
const cors = require("cors");
const AppError = require("./utils/AppError");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const priceListRouter = require("./routes/priceList");
const utilsRouter = require("./routes/utils");
const globalErrorHandler = require("./controllers/errorControllers");
const cron = require("./utils/cron");

const app = express();

dotenv.config({
  path: "./.env",
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection! Shutting down...");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught exception! Shutting down...");
  process.exit(1);
});

app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/", indexRouter);
app.use("/api/v1/", usersRouter);
app.use("/api/v1/", priceListRouter);
app.use("/api/v1/", utilsRouter);
app.use(
  "/application",
  express.static(path.join(__dirname, "/front/build"), { maxAge: 0 })
);

app.use("/application/*", (req, res) => {
  res.sendFile(path.join(__dirname, "front/build/index.html"));
});

app.all("/api/v1/*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "front/build/index.html"));
});

app.use(globalErrorHandler);

module.exports = app;
