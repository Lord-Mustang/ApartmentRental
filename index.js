const config = require("./config/config.json");
const express = require("express");
const bodyParser = require("body-parser");
const apiv1 = require("./routes/apiv1");
const auth = require("./routes/auth");
const logger = require("tracer").colorConsole();
const loggerFile = require("tracer").dailyfile({
  root: "./logs",
  maxLogFiles: 10,
  allLogsFileName: "apartments",
  format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
  dateformat: "HH:MM:ss.L"
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middelware, logging voor alle request
app.all("*", function(req, res, next) {
  loggerFile.info("%s", req.hostname);
  next();
});

// Routing without JWT
app.use("/auth", auth);

// Routing protected by JWT
app.use("/apiv1", apiv1);
//app.use("/apiv2", apiv2);

// Optional log error
function errorLoggerHandler(err, req, res, next) {
  loggerFile.error("%s", err.message);
  next(err);
}

// Set default error handler
function errorResponseHandler(err, req, res, next) {
  res.status(500);
  res.json({ msg: "Go, you hacker!" });
}

// Register the error handlers
app.use(errorLoggerHandler);
app.use(errorResponseHandler);

// ECMA 6
const port = process.env.PORT || config.remote.port;
const server = app.listen(port, () => {
  logger.info(
    "The Apartments app, the magic happens at port " + server.address().port
  );
});

module.exports = app;
