const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const path = require("path");

module.exports = function() {
  let app = express();
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(compression);
  }
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json());
  app.use(cors());
  app.use("/static", express.static(path.join(__dirname + "/../public")));

  require("../services/routers")(app);
  return app;
};
