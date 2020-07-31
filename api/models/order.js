const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  orderid: mongoose.Schema.Types.ObjectId,
  cust_id: {type:String, required: true},
  product_id: { type: String, required: true },
  product_quantity: { type: Number, required: true },
  overall_price: { type: Number, required: true },
  status: {type: String, required: true}
});

module.exports = mongoose.model('order', orderSchema);
