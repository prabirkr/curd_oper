const express = require('express');
const { getUser, createUser, getUserById, updateUser, deleteUser } = require('../controller/userController');
const authorization = require('../middleware/authorization');
const { loginValidation } = require('../middleware/validation');


const router = express.Router();

router.get("/", getUser);
router.get("/:id", authorization,getUserById);
router.post("/", loginValidation,createUser);
router.put("/:id", authorization,updateUser);
router.delete("/:id", deleteUser);

module.exports = router;