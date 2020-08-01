const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');



router.post("/login", UserController.user_login);
router.post("/register", UserController.signup_user);


module.exports = router;