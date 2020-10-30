const User = require("../models/user");
const Transaction = require("../models/transactions");
const { errorHandler } = require("./dbErrorHandler");

// To find user by userId
exports.findUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Signin required to proceed",
      });
    }
    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

// update user
exports.update = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to perform this action",
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  );
};

// transactions history for the user
exports.transactionHistory = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "date";

  Transaction.find({ user: req.profile._id })
    .populate("user", "_id name")
    .sort([[sortBy, order]])
    .exec((err, transactions) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(transactions);
    });
};
