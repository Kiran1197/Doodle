const mongoose = require('mongoose');
const Product = require('../models/product');
const { update, insertMany } = require('../models/product');



exports.create_product = (req, res, next) => {
  const product = new Product({
   // _id: new mongoose.Types.ObjectId(),
    productName: req.body.productName,
    category: req.body.category,
    price: req.body.price,
    quantity: req.body.quantity,
    status: 'active'
    
  });
  Product.find({ username: req.body.username })
  .exec()
  .then((result)=>{
    console.log(result);
    if(result.length >= 1){
      delete product._id;
     Product.findOneAndUpdate({productName:req.body.productName},product,{returnNewDocument: true})
     .exec()
     .then(result=>{
      res.status(200).json({
        message: 'Record updated',
        createdProduct: {
          id: result._id,
          productName: result.productName,
          category: result.category,
          price: result.price,
          quantity: result.quantity
        },
      });
     })
      .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
    }
    else{
      insert(req,res,product);
    }
  });
}   

  function insert(req,res,product)
  {
    product
    .save() 
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'New Product created!',
        createdProduct: {
          productName: result.productName,
          category: result.category,
          price: result.price,
          quantity: result.quantity
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  }
  
