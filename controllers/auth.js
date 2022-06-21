const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req, res = response) => {

  const { email, password } = req.body;
  
  try {
    //Search user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "user/password incorrect - email"
      });
    }

    if (!user.state) {
      return res.status(400).json({
        msg: "user/password incorrect - state false"
      });
    }

    const isValidPasword = bcryptjs.compareSync(password, user.password);
    if (!isValidPasword) {
      return res.status(400).json({
        msg: "user/password incorrect - password"
      });
    }

    //Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token
    });
    
  } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Get on to admin",
      });
  }
}

const googleSignIn = async( req, res = response ) => {

  const { id_token } = req.body;

  try {
    
    const { name, img, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });
    
    if (!user) {
      const data = {
        name,
        email,
        password: 'xD',
        img,
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    if (user.status === false) {
      return res.status(401).json({
        msg: "Get on to admin, user hidden"
      })
    }

     //Generate JWT
     const token = await generateJWT(user.id);

    res.json({
      user,
      token
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Token couldn't be verified"
    })
  }

}

const renewToken = async(req, res = response) => {

  const { user } = req;

  const token = await generateJWT(user.id);

  res.json({
    user,
    token
  });
}

module.exports = {
  login,
  googleSignIn,
  renewToken
};