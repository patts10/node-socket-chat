const { Router } = require("express");
const { check } = require("express-validator");
const { saveFile, updateImage, showImage, updateImageCloudinary } = require("../controllers/uploads");
const { allowedCollections } = require("../helpers");
const { checkFields, validateFileToLoad } = require("../middlewares");

const router = Router();

router.get('/:collection/:id',[
  check('id', 'Id is not a mongoId').isMongoId(),
  check('collection').custom( c => allowedCollections(c, ['users', 'products'] )),
  checkFields
], showImage)

router.post('/',[
  validateFileToLoad
], saveFile);

router.put('/:collection/:id',[
  validateFileToLoad,
  check('id', 'Id is not a mongoId').isMongoId(),
  check('collection').custom( c => allowedCollections(c, ['users', 'products'] )),
  checkFields
] , updateImageCloudinary);
// ] , updateImage);

module.exports = router;