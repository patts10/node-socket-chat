const { Router } = require("express");
const { check } = require("express-validator");
const { createCategory, 
        getCategories, 
        getCategoryById, 
        updateCategory, 
        deleteCategory } = require("../controllers/categories");
const { existCategoryById } = require("../helpers/db-validators");

const { validateJWT, checkFields, isAdminRole } = require("../middlewares");

const router = Router();

router.get('/', getCategories);

router.get('/:id',[
  check('id', 'id is not valid Mongo id').isMongoId(),
  check("id").custom(existCategoryById),
  checkFields
], getCategoryById);

router.post('/',[
  validateJWT,
  check('name', 'name is required').not().isEmpty(),
  checkFields
], createCategory);

router.put('/:id',[
  validateJWT,
  check('name', 'name is required').not().isEmpty(),
  check('id', 'id is not valid Mongo id').isMongoId(),
  check("id").custom(existCategoryById),
  checkFields
], updateCategory);

router.delete('/:id',[
  validateJWT,
  isAdminRole,
  check('id', 'id is not valid Mongo id').isMongoId(),
  check("id").custom(existCategoryById),
  checkFields
  
], deleteCategory);

module.exports = router;