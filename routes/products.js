const { Router } = require("express");
const { check } = require("express-validator");

const { createProduct, 
        getProducts, 
        updateProduct, 
        deleteProduct, 
        getProductById } = require("../controllers/products");

const { existProductById, existCategoryById } = require("../helpers/db-validators");

const { validateJWT, checkFields, isAdminRole } = require("../middlewares");

const router = Router();

router.get('/', getProducts);

router.post('/',[
  validateJWT,
  check('name', 'name is required').not().isEmpty(),
  check('category', 'category is not valid Mongo id').isMongoId(),
  check("category").custom(existCategoryById),
  checkFields
], createProduct);


router.put('/:id',[
  validateJWT,
  // check('id', 'id is not valid Mongo id').isMongoId(),
  check("id").custom(existProductById),
  checkFields
], updateProduct);

router.delete('/:id',[
  validateJWT,
  check('id', 'id is not valid Mongo id').isMongoId(),
  check("id").custom(existProductById),
  isAdminRole,
  checkFields
], deleteProduct);

router.get('/:id',[
  // check('id', 'id is not valid Mongo id').isMongoId(),
  check("id").custom(existProductById),
  checkFields,
], getProductById);

module.exports = router;