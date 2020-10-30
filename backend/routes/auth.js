const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  signout,
  requireSignin,
} = require("../controllers/auth");

// validator
const { runValidation } = require("../validators");
const { userSignupValidator } = require("../validators/auth");

// user path for signup & signin
router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// test
router.get("/secret", requireSignin, (req, res) => {
  res.json({
    message: "you have access to secret page",
  });
});

module.exports = router;
