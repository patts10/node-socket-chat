const path = require('path');
const fs   = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLODINARY_URL);

const { response } = require('express');
const { loadFile } = require('../helpers');

const { User, Product } = require('../models');
const { env } = require('process');

const saveFile = async(req, res = response) => {

    try {
        const name = await loadFile( req.files, undefined, 'imgs' );
        res.json({ name });
    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const updateImage = async(req, res) => {

  const { id, collection } = req.params;

  let model;

  switch ( collection ) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `It does not exist user with id ${ id }`
        });
      }

      break;

    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `It does not exist product with id ${ id }`
        });
      }

      break;
  
    default:
      res.status(500).json({
        msg: 'I forgot to validate this! :-)'
      });
  }

  if (model.img) {
    const pathImg = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }


  const name = await loadFile( req.files, undefined, collection );
  model.img = name;

  await model.save();
  
  res.json( model );
}

const showImage = async(req, res = response) => {

  const { id, collection } = req.params;

  let model;

  switch ( collection ) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `It does not exist user with id ${ id }`
        });
      }

      break;

    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `It does not exist product with id ${ id }`
        });
      }

      break;
  
    default:
      res.status(500).json({
        msg: 'I forgot to validate this! :-)'
      });
  }

  if (model.img) {
    const pathImg = path.join(__dirname, '../uploads', collection, model.img);
    if(fs.existsSync(pathImg)) {
      return res.sendFile( pathImg );
    }
  }
  
  const placeholderPath = path.join(__dirname, '../assets/no-image.jpg')
  res.sendFile(placeholderPath);
}

const updateImageCloudinary = async(req, res) => {

  const { id, collection } = req.params;

  let model;

  switch ( collection ) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `It does not exist user with id ${ id }`
        });
      }

      break;

    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `It does not exist product with id ${ id }`
        });
      }

      break;
  
    default:
      res.status(500).json({
        msg: 'I forgot to validate this! :-)'
      });
  }

  if (model.img) {
    const nameArr = model.img.split('/');
    const name = nameArr[nameArr.length - 1];
    const [ public_id ] = name.split('.');

    await cloudinary.uploader.destroy( public_id );
  
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath)

  model.img = secure_url;

  await model.save();
  
  res.json( model );
}

module.exports = {
  saveFile,
  updateImage,
  showImage,
  updateImageCloudinary,
}