const mongoose = require('mongoose');

const QuantitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
  productId: {type:String, required: true},
  quantity: { type: Number, required: true }
});

module.exports = mongoose.model('ProductQuantity', QuantitySchema);
