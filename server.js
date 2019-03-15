var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("./models/users");
var passportSetup = require("./config/passport");
var path = require("path");
var flash = require("connect-flash");
var keys = require(".config.keys");
// get an instance of router
var router = express.Router();

// Conenct to DB
mongoose.connect(keys.mongo.id);

var db = mongoose.connection;
// Parse JSON from request, add Session and add passport middleware

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(flash());
// Express Session
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Session: An object saved by the backend for one user.

// Let's add an endpoint to save users to database. (P.S. Nothing from passport is used here)

app.use("/auth", router);

const authCheck = (req, res, next) => {
  // this is the mongoID assigned to user
  if (req.user) {
    // if user not logged in
    res.redirect("/logged");
  } else {
    next();
  }
};

app.get("/", authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Register User

app.post("/register", function(req, res, next) {
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

app.post("/add", function(req, res) {
  // this is the user object
  console.log(req.user._id);

  var user = { id: req.user._id };
  var data = { data: req.body.input };
  console.log(user.id + " is  saving " + data.data);
  User.findOneAndUpdate(user.id, { $push: data }, function(err, doc) {
    if (err) return res.send(500, { error: err });
    return res.send("succesfully saved");
  });
});

app.post("/login", function(req, res, next) {
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

// Endpoint to get current user
app.get("/user", function(req, res) {
  if (!req.user) {
    res.send("no user logged in");
  } else {
    res.send(req.user);
  }
});

// Endpoint to logout
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/logged");
});

/// logged in--->

const authCheckLogged = (req, res, next) => {
  // this is the mongoID assigned to user
  if (!req.user) {
    // if user not logged in

    res.redirect("/");
  } else {
    next();
  }
};

// this is the "inner page" - in order to access it, you need to pass the "authCheck" above

app.get("/logged", authCheckLogged, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "logged.html"));
});

app.use(express.static("public"));
app.listen(3000, () => console.log("App listening on port 3000!"));
