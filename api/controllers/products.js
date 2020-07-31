const mongoose = require('mongoose');
const Product = require('../models/product');
const ProductQuantity = require('../models/availableQuantity');

exports.create_product = (req, res, next) => {
  const product = new Product({
    productName: req.body.productName,
    category: req.body.category,
    price: req.body.price,
  });
  Product.find({ productName: req.body.productName })
  .exec()
  .then((result)=>{
    console.log(result);
    if(result.length >= 1){
      var prod_id = result[0]._id.toString()
      ProductQuantity.find({ productId: prod_id})
      .exec() 
      .then((quantityFind)=>{
        const productQuantity = new ProductQuantity({
          productId: prod_id,
          quantity: req.body.quantity
        });
            Product.findOneAndUpdate({productName:req.body.productName},product)
            .exec()
            .then((productRes)=>{
              ProductQuantity.findOneAndUpdate({productId: prod_id},productQuantity)
                  .exec()
                  .then(result=>{
                        res.status(200).json({
                        message: 'Record updated Succesfully'
                  });
                  })
                  .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
              })
              .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            })
          })
    }
    else{
      insert(req,res,product);
    }
  });
}   





  function insert(req,res,product)
  {
    product._id= new mongoose.Types.ObjectId();
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