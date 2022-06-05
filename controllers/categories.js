const { response } = require("express");
const { Category } = require("../models");

const getCategories = async(req, res) => {

  const { limit=5, since=0 } = req.query;
  const query = { state: true };

  const [ total, categories ] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .skip(Number(since))
      .limit(Number(limit))
      .populate('user', 'name')
  ]);

  res.json({
    total,
    categories
  });
}

const createCategory = async(req, res = response) => {
  
  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne({ name });

  if(categoryDB)  {
    return res.status(400).json({
      msg: `Category ${ categoryDB.name } already exists`
    });
  }

  const data = {
    name,
    user: req.user._id
  }

  const category = new Category( data );

  category.save();

  res.status(201).json(category)
}

const updateCategory = async(req, res) => {

  const { id } = req.params;
  const { state, user, ...data } = req.body;
  data.name = req.body.name.toUpperCase();
  data.user = req.user._id;

  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json(category);
}

const deleteCategory = async(req, res) => { 
  const { id } = req.params;

  const categoryDeleted = await Category.findByIdAndUpdate(id, { state: false }, { new: true });

  res.status(200).json(categoryDeleted);
}

const getCategoryById = async(req, res) => {
  
  const { id } = req.params;

  const category = await Category.findById(id)
                    .populate('user', 'name');
  res.status(200).json({category});

}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById
}