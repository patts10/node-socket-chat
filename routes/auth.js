const { Router } = require("express");
const { check } = require("express-validator");

const { login, googleSignIn, renewToken } = require("../controllers/auth");
const { checkFields, validateJWT } = require("../middlewares");

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

router.get("/", validateJWT, renewToken );

module.exports = router;