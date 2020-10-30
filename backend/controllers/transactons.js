const Transaction = require("../models/transactions");
const { errorHandler } = require("./dbErrorHandler");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

require("dotenv").config();

// create new transaction
exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    // check for all fields
    const {
      amount,
      transaction_type,
      // description,
      category,
      // invoice_photo,
      date,
      user,
    } = fields;

    if (!amount || !transaction_type || !category || !date) {
      return res.status(401).json({
        error: "All fields are required!",
      });
    }

    let transaction = new Transaction(fields);

    if (files.invoice_photo) {
      if (files.invoice_photo.size > 2000000) {
        return res.status(400).json({
          error: "Image should be less than 2MB",
        });
      }
      transaction.invoice_photo.data = fs.readFileSync(
        files.invoice_photo.path
      );

      transaction.invoice_photo.contentType = files.invoice_photo.type;
    }

    transaction.save((err, result) => {
      if (err) {
        if (errorHandler(err)) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else {
          return res.status(400).json({
            error: "Category or User is not valid",
          });
        }
      }
      res.json(result);
    });
  });
};

// list all transactions of user sort by date
exports.listAll = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "date";

  Transaction.find()
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

// find the transaction by ID
exports.findTransactionById = (req, res, next, id) => {
  Transaction.findById(id)
    .populate("category", "_id name", "user", "_id name")
    .exec((err, transaction) => {
      if (err || !transaction) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.transaction = transaction;
      next();
    });
};

// update transaction
exports.updateTransaction = (req, res) => {
  Transaction.update(
    { _id: req.body.transactionId },
    { $set: req.body },
    { new: true },
    (err, transaction) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(transaction);
    }
  );
};
