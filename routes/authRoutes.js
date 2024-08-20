const express = require('express');
const { login, register } = require('../controller/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');




const router = express.Router();

router.post("/register", registerValidation,register)
router.post("/login", loginValidation,login);




module.exports = router;