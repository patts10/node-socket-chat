const { response } = require("express");
const { User, Category, Product } = require("../models");
const { ObjectId } = require('mongoose').Types;

const allowedCollections = [
  'users',
  'categories',
  'products',
  'roles'
];

const search = (req, res = response) => {
  
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Allowed collections are ${ allowedCollections }`
    })
  }

  const searchUsers = async( term = '', res = response ) => {

    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
      const user = await User.findById(term);
      return res.json({
        results: user ? [ user ] : []
      });
    }

    const regex = RegExp( term, 'i' );
    const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ state: true }]
    });

    return res.json({
      results: users
    });
  }

  const searchCategories = async(req, res) => {
     
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
      const category = await Category.findById(term);
                        
      return res.json({
        results: category ? [ category ] : []
      });
    }

const regex = RegExp(term, 'i')
    const category = await Category.find({ name: regex, state: true });                        
    return res.json({
      results: category
    })
  }

  const searchProducts = async(req, res) => {
     
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
      const product = await Product.findById(term)
                        .populate('product', 'name');
      return res.json({
        results: product ? [ product ] : []
      });
    }

  const regex = RegExp(term, 'i')
    const product = await Product.find({ name: regex, state: true })
                      .populate('category', 'name');
    return res.json({
      results: product
    })
  }

  switch (collection) {
    case 'users':
      searchUsers(term, res);
      break;
    case 'categories':
      searchCategories(term, res);
      break;
      case 'products':
        searchProducts(term, res);
      break;
  
    default:
      res.status(500).json({
        msg: 'This search is invalid'
      })
  }
}

module.exports = {
  search
}