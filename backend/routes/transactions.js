const express = require("express");
const router = express.Router();

const { create, listAll } = require("../controllers/transactons");
const { requireSignin, isAuth } = require("../controllers/auth");
const { findUserById } = require("../controllers/user");

// validator
const { runValidation } = require("../validators");
const { transactionsValidator } = require("../validators/transactions");

router.post(
  "/transactions/create/:userId",
  requireSignin,
  isAuth,
  runValidation,
  transactionsValidator,
  create
);
router.get("/transactions/list/:userId", requireSignin, isAuth, listAll);

router.param("userId", findUserById);

module.exports = router;
