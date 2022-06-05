
const dbValidators = require('./db-validators');
const generateJWT = require('./generate-jwt');
const googleVerify = require('./google-verify');
const loadFile = require('./load-file');

module.exports = {
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...loadFile
}