const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products');

//const checkAuth = require('../middleware/check-auth');

router.post("/insert", ProductController.create_product);


// router.delete("/:userId", checkAuth, UserController.delete_user);


module.exports = router;