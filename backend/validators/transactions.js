const { check } = require("express-validator");

exports.transactionsValidator = [
  check("amount").not().isEmpty().withMessage("Amount is required"),
  check("amount")
    .not()
    .isFloat()
    .withMessage("Amount should be integer or float"),
  check("transaction_type")
    .not()
    .isEmpty()
    .withMessage("Transaction type cannot be null"),
  check("date").isDate().withMessage("Date must be valid"),
];
