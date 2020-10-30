const shortId = require("shortid"); // create profile ID
const jwt = require("jsonwebtoken"); // generate token
const expressJwt = require("express-jwt"); // for authorization check

const User = require("../models/user");

const { errorHandler } = require("./dbErrorHandler");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const { name, email, password } = req.body;
    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    let newUser = new User({ name, email, password, profile, username });
    newUser.save((err, success) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: errorHandler(err),
        });
      }

      res.json({
        message: "Signup success! Please signin.",
      });
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup.",
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match.",
      });
    }
    //generate token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { expiresIn: "1h" });

    const { _id, username, name, email, role } = user;
    return res.json({
      token,
      user: { _id, username, name, email, role },
      message: "Signin success!",
    });
  });
};

// signout
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout success!",
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"], // for session
  // algorithms : ['RS256'] // for cross application authentication (eg: auth0)
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};
