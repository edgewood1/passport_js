var express = require("express");
var router = express.Router();
var passport = require("passport");

// Register User

router.post("/register", function(req, res, next) {
  passport.authenticate("register", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send(info.message);
    }
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      // res.redirect("/logged");
      res.send({ redirect: "/logged", message: info.message });
    });
  })(req, res, next);
});

// user log in

router.post("/login", function(req, res, next) {
  passport.authenticate("login", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send(info);
    }
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      // res.redirect("/logged");
      res.send({ redirect: "/logged" });
    });
  })(req, res, next);
});

// Endpoint to logout
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/logged");
});

module.exports = router;
