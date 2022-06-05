const { Product } = require("../models");

const getProducts = async(req, res) => {

  const { limit = 5, since = 0 } = req.query;
  const query = { state: true };

  const [ total, products ] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .skip(Number(since))
      .limit(limit)
      .populate('user', 'name')
      .populate('category', 'name')
  ]);

  res.json({
    total,
    products
  });
}

const createProduct = async(req, res) => {

  const { estate, user, ...body } = req.body;
  // body.name = req.body.name.toUpperCase();
  const productDB = await Product.findOne({ name: body.name });
  if (productDB) {
    return res.status(400).json({
      msg: `Product ${ productDB.name } already exist`
    });
  }

  const data = {
    ...body,
    user: req.user._id
  }

  const product = new Product(data);
  product.save();
  
  res.status(201).json(product)
}

const updateProduct =async(req, res) => {
  
  const { id } = req.params;
  const { state, user, ...data } = req.body;
  
  if (data.name) {
    data.name = req.body.name.toUpperCase();
  }

  data.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  
  res.json(product)
}

const deleteProduct = async(req, res) => {

  const { id } = req.params;
  const ProductDeleted = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

  res.json(ProductDeleted)
}

const getProductById =async(req, res) => {

  const { id } = req.params;
  const product = await Product.findById(id)
                    .populate('user', 'name')
                    .populate('category', 'name');

  res.json(product)
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
}