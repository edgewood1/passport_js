var express = require("express");
var router = express.Router();
var path = require("path");

// logged out --->

router.use(express.static("public"));

const authCheck = (req, res, next) => {
  // this is the mongoID assigned to user
  if (req.user) {
    // if user not logged in
    res.resendFile(path.join(__dirname, "..", "public", "logged.html"));
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

/// logged in--->

const authCheckLogged = (req, res, next) => {
  // this is the mongoID assigned to user
  if (!req.user) {
    // if user not logged in
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
    // res.redirect("/");
  } else {
    next();
  }
};

router.get("/logged", authCheckLogged, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "logged.html"));
});

module.exports = router;
