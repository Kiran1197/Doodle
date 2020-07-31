const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const { route } = require('./productRoute');


router.delete("/cancel",orderController.cancel_order);
router.post("/placeorder", orderController.place_order);
router.put("/updateorder", orderController.update_order);

module.exports = router;