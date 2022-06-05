const { response } = require("express");


const validateFileToLoad = (req, res =response, next) => {

  console.log(req.files);
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).json({
      msg: 'There is no file to load - validateFileToLoad'
    });
  }
  next();
}

module.exports = {
  validateFileToLoad
}