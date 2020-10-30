const express = require("express");
const router = express.Router();

const { requireSignin, isAuth } = require("../controllers/auth");
const { findUserById, transactionHistory } = require("../controllers/user");

router.get("/secret/:userId", requireSignin, isAuth, (req, res) => {
  console.log(req.profile);
  res.json({
    user: req.profile,
  });
});
router.get("/transactions/:userId", requireSignin, isAuth, transactionHistory);

router.param("userId", findUserById);

module.exports = router;
