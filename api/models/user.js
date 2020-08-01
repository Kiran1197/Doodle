const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {type:String, required: true},
  firstname: { type: String, required: true },
  lastname: { type: String },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
