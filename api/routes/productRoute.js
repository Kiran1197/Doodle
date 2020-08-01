const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products');


router.post("/insert", ProductController.create_product);



module.exports = router;