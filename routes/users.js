const { Router } = require("express");
const { check } = require("express-validator");

const {
        checkFields, 
        validateJWT, 
        isAdminRole, 
        hasRole 
} = require('../middlewares')

const { isValidRole, isValidEmail, existUserById } = require("../helpers/db-validators");

const { usersGet, 
        usersPost, 
        usersPut, 
        usersPatch, 
        usersDelete } = require("../controllers/users");

const router = Router();

router.get("/", usersGet);

router.post("/", [
        check('name', 'name is required').not().isEmpty(),
        check('password', 'password is required').not().isEmpty(),
        check('password', 'password should have 6 characters at least').isLength({ min: 6 }),
        check('email', 'Email is not valid').isEmail(),
        // check('role', 'role is not valid').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('email').custom(isValidEmail),
        check('role').custom( isValidRole ),
        checkFields
], usersPost);

router.put("/:id", [
        check('id', 'id is not valid').isMongoId(),
        check('id').custom( existUserById ),
        check('role').custom( isValidRole ),
        checkFields
], usersPut);

router.delete("/:id",[
        validateJWT,
        // isAdminRole,
        hasRole('ADMIN_ROLE', 'SALE_ROLE'),
        check('id', 'id is not valid').isMongoId(),
        check('id').custom( existUserById ),
        checkFields
], usersDelete);

router.patch("/", usersPatch);

module.exports = router;
