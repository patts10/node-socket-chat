const { Router } = require("express");
const { check } = require("express-validator");

const { login, googleSignIn } = require("../controllers/auth");
const { checkFields } = require("../middlewares/check-fields");

const router = Router();

router.post("/login",[
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
  checkFields
], login);

router.post("/google",[
  check('id_token', 'id token is necessary').not().isEmpty(),
  checkFields
], googleSignIn);

module.exports = router;