var express = require("express");
var router = express.Router();
var User = require("../models/users");

router.post("/add", function(req, res) {
  // this is the user object
  console.log(req.user._id);

  var user = { _id: req.user._id };
  var data = { data: req.body.input };
  console.log(user._id + " is  saving " + data.data);
  User.findOneAndUpdate(user, { $push: data }, function(err, doc) {
    if (err) return res.send(500, { error: err });
    console.log(doc);
    return res.send("succesfully saved");
  });
});

module.exports = router;
