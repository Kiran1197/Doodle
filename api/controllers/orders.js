const mongoose = require('mongoose');
const Order = require('../models/order');
const Product=require('../models/product');
var p_quantity;

exports.place_order = (req, res, next) => {
    Product.find({productName:req.body.productName})
    .exec()
    .then((result)=>
    {
        p_quantity=result[0].quantity;
        console.log("result "+result[0].quantity);
        const order = new Order({
        orderid: new mongoose.Types.ObjectId(),
        cust_id: '5f228d70e3c8370a249619f2',
        product_id: result[0]._id,
        product_quantity: req.body.quantity,
        overall_price: result[0].price*req.body.quantity
    })
    console.log(order);
    insert(req,res,order);
  })
  .catch((err) => {
    console.log( err);
    res.status(500).json({
      error: err,
    });
  });
}

exports.update_order=(req,res,next)=>{

    Order.find({orderid:req.body.id})
    .exec()
    .then(result=>{
        var newPrice=result[0].overall_price;
        console.log(newPrice/result[0].overall_quantity);
        const order = new Order({
                _id: result[0]._id,
                orderid: result[0].orderid,
                cust_id: '5f228d70e3c8370a249619f2',
                product_id: result[0].product_id,
                overall_price: 50000,
                product_quantity: req.body.quantity
                })
                Order.findByIdAndUpdate({id:req.body.id},order,(err,updateResult)=>{
                    console.log(order);
                    if(!err){
                        return res.status(201).json({
                            message: "Record updated"
                        })
                    }
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
      });
}
 
exports.cancel_order=(req,res,next)=>{
    console.log(req.body.id);
        Order.findOneAndDelete({orderid:req.body.id})
        .exec()
        .then(result=>{
            console.log(result);
            return res.status(200).json({
                message: "Ordered cancelled succesfully"
            })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });  
}

function insert(req,res,order)
  {
      console.log("insert function" + order);
    order
    .save()
    .then((result) => {
     Product.findOneAndUpdate({userName:req.body.productname},p_quantity-req.body.quantity,(quanityResult)=>{
         //console.log(quanityResult);
        //console.log(result);
          res.status(200).json({
          message: 'New Product created!',
          createdProduct: {
            orderid: result.orderid,
            cust_id: result.cust_id,
            p_id: result.product_id,
            quantity: result.quantity,
            overall_price: result.overall_price,
            status: 'Active'
          },
        });
     });
    })
    .catch((err) => {
      console.log("main err "+ err);
      res.status(500).json({
        error: err,
      });
    });
}
  
