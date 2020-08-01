const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');

const checkAuth=require('../middleware/auth');

//router.post('/', checkAuth, NoteController.notes_create_note);
router.put("/cancel",orderController.cancel_order);
router.post("/placeorder",checkAuth, orderController.place_order);
router.put("/updateorder",checkAuth, orderController.update_order);
router.get("/viewDate",orderController.view_orders_date);
router.get("/viewCustomer/:cid",orderController.view_orders_customer);
router.get("/viewCustomers",orderController.view_all_customer_orders);
module.exports = router;