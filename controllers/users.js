const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const usersGet =async(req = request, res = response) => {

  const {limit = 5, since=0, page = 1} = req.query;
  const query = {state: true};

    // const users = await User.find(query)
  //   .skip( Number(since) )
  //   .limit(Number(limit));

  // const  total = await User.countDocuments(query);

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .skip( Number(since) )
      .limit(Number(limit))
  ]);

  res.json({
    total,
    users
  });
}

const usersPost = async( req = request, res = response ) => {

  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  //Encrypt password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync( password, salt );

  await user.save();

  res.json({
    user
  });
}

const usersPut = async(req, res) => {

  const id = req.params.id;
  const { _id, password, google, email, ...rest } = req.body;

  if ( password ) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync( password, salt );
  }

  const user = await User.findByIdAndUpdate( id, rest );
  console.log(user);
  console.log(rest);
  res.json(user);
}

const usersPatch = (req, res) => {
  res.json({
    msg: "patch API - controller",
  });
}

const usersDelete = async(req, res) => {

  const { id } = req.params;
  const user = await User.findByIdAndUpdate( id, { state: false } );

  res.json(user);
}



module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete
}