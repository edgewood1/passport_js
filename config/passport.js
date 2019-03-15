const passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/users");

passport.serializeUser(function(user, done) {
  // null - takes an error
  // user is the object with _id, username, password
  // user.id - the mongoID > this gets stuffed in a cookie
  // user.id below saved to session req.session.passport.user
  // is this the cookie?
  // then its passed to the id argument of deserializer
  done(null, user.id);
});

// returning user has a cookie,
// this gets id from cookie
// check to see who the cookie belongs to
passport.deserializeUser(function(id, done) {
  // search for this id in mongo - is this the right one?
  // why isn't its encrypted?
  // can anyone grab this id and use it?
  User.getUserById(id, function(err, user) {
    // User.findById(id).then(user => {
    // "user" is an object with a key of _id
    // user attaches to request as req.user
    // done(null, user._id)
    // done(null, user);
    done(err, user);
  });
});

passport.use(
  "register",
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }).then(currentUser => {
      if (currentUser) {
        //already have user
        console.log("user is ", currentUser);
        // done will go to serializer...
        done(null, false, { message: "Login: You're already in the system" });
      } else {
        // create new user
        var newUser = new User({
          username: username,
          password: password
        });

        User.createUser(newUser, function(err, user) {
          if (err) throw err;
          console.log("user created!!!!");
          // res.send(user).end();
          return done(null, user, { message: "user created!! " });
        });
        // .save()
        // .then(newUser => {
        //   console.log("new User created: " + newUser);
        //   //   done(profile);
        //   done(null, newUser, { message: "new user created!" });
        // });
      }
    });
  })
);

passport.use(
  "login",
  new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "Unknown User" });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid password - try again" });
        }
      });
    });
  })
);

// passport.use(
//   "login",
//   new LocalStrategy(function(username, password, done) {
//     console.log("lookgin for ... ", username + " with pw of " + password);
//     User.getUserByUsername(username, function(err, user) {
//       if (err) throw err;
//       if (!user) {
//         return done(null, false, { message: "Unknown User" });
//       }
//       User.comparePassword(password, user.password, function(err, isMatch) {
//         console.log("comparing " + password + " to " + user.password);
//         if (err) throw err;
//         if (isMatch) {
//           return done(null, user);
//         } else {
//           return done(null, false, { message: "Invalid password" });
//         }
//       });
//     });
//   })
// );
//     User.findOne({ username: username }, function(err, currentUser) {
//       if (err) {
//         return done(err);
//       }
//       if (!currentUser) {
//         return done(null, false, { message: "Incorrect username" });
//       }
//       //already have user
//       if (!User.comparePassword(password)) {
//         return done(null, false, { message: "Incorrect password" });
//       }
//       return done(null, currentUser);
//     });
//   })
// );

module.exports = passport;
