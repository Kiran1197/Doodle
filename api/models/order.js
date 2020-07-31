const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cust_id: {type:String, required: true},
  product_id: { type: String, required: true },
  product_quantity: { type: Number, required: true },
  overall_price: { type: Number, required: true },
  ordered_date: {type:Date},
  status: {type: String, required: true}
});

module.exports = mongoose.model('order', orderSchema);
