const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const { route } = require('./productRoute');


router.put("/cancel",orderController.cancel_order);
router.post("/placeorder", orderController.place_order);
router.put("/updateorder", orderController.update_order);
router.get("/viewDate",orderController.view_orders_date);
module.exports = router;