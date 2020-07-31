const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');

//const checkAuth = require('../middleware/check-auth');

router.post("/login", UserController.user_login);
router.post("/register", UserController.signup_user);

// router.post("/login", UserController.user_login);

// router.delete("/:userId", checkAuth, UserController.delete_user);


module.exports = router;