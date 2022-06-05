const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async(req = request, res = response, next) => {

  const token = req.header('x-token'); 

  if (!token) {
    return res.status(401).json({
      msg: 'No token, authorization denied'
    });
  }
  
  try {

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user= await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: "Token invalid - user does not exist in DB"
      })
    }

    if (!user.state) {
      return res.status(401).json({
        msg: "Token invalid - user state: false"
      })
    }

    req.user = user;
    
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token invalid'
  });
  }
}





module.exports = {
  validateJWT,
}