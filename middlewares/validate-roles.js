const { response } = require("express");

const isAdminRole = ( req, res=response, next ) => {

  if (!req.user) {
    return res.status(500).json({
      msg: "you need to validate token first is you want to verify role"
    });
  }

  const { role, name } = req.user;

  if ( role !== 'ADMIN_ROLE' ) {
    return res.status(401).json({
      msg: `${ name } is not admin`
    })
  }

  next();
}

const hasRole = ( ...roles ) => {

  console.log(roles);

  return ( req, res=response, next ) => {

    if (!req.user) {
      return res.status(500).json({
        msg: "you need to validate token first is you want to verify role"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `The service require some of these roles ${ roles }`
      });
      
    }

    next();
  }
}

module.exports = {
  isAdminRole,
  hasRole
}