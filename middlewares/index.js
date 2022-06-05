
const checkFields = require("../middlewares/check-fields");
const validateFileToLoad = require("../middlewares/validate-file");
const validateJWT = require("../middlewares/validate-jwt");
const validateRoles = require("../middlewares/validate-roles");

module.exports = {
  ...checkFields,
  ...validateFileToLoad,
  ...validateJWT,
  ...validateRoles
}