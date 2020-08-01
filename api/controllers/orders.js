const mongoose = require('mongoose');
const Order = require('../models/order');
const Product=require('../models/product');
const ProductQuantity=require('../models/availableQuantity');
const {ObjectId} = require('mongodb');

var p_quantity;
exports.place_order = (req, res, next) => {
  Product.find({productName:req.body.productName})
  .exec()
  .then((result)=>
  {
    if(result.length>=1){
      var p_id=result[0]._id;
      ProductQuantity.find({productId:p_id})
      .exec()
      .then(quantityRes=>{
        p_quantity=quantityRes[0].quantity-req.body.quantity;
        if(quantityRes[0].quantity>=req.body.quantity)
        {
          const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            cust_id: req.body.customerID,
            product_id: result[0]._id,
            product_quantity: req.body.quantity,
            overall_price: result[0].price*req.body.quantity,
            ordered_date: new Date(),
            status: 'active'
            })
          insert(req,res,order,p_id,p_quantity);
        }
        else{
          res.status(500).json({
            message: "Insufficient Quantity",
          });
        }
  })
  .catch((err) => {
    console.log( err);
    res.status(500).json({
      error: err,
    });
  });
}
else{
  res.status(500).json({
    Message: "Item Not available",
  });
}
})
.catch((err) => {
  console.log( err);
  res.status(500).json({
    error: err,
  });
});
    }
exports.update_order=(req,res,next)=>{
    Order.find({_id:ObjectId(req.body.orderId)})
    .exec()
    .then(result=>{
      //var id=result[0].productId;
          ProductQuantity.find({productId:result[0].product_id})
          .exec()
          .then(quantityRes=>{
            if(quantityRes[0].quantity>=req.body.quantity)
            {
              Product.find({_id:ObjectId(result[0].product_id)})
              .exec()
              .then(productRes=>{
                const order = new Order({
                  cust_id: req.body.customerID,
                  product_id: '5f23dcea5db3c3363c0a30ee',
                  product_quantity: req.body.quantity,
                  overall_price: productRes[0].price*req.body.quantity,
                  ordered_date: new Date(),
                  status: 'active'
                  });
                  Order.findOneAndUpdate({_id:req.body.orderId},order)
                  .exec()
                  .then(finalResult=>{
                    const productQuantity=new ProductQuantity(
                      {
                        quantity: quantityRes[0].quantity-req.body.quantity+result[0].product_quantity
                      }
                    )
                   console.log(result[0].product_quantity);
                   ProductQuantity.findOneAndUpdate({productId:result[0].product_id},productQuantity)
                   .exec()
                   .then(quantityResult=>{
                    res.status(200).json({
                      Message:"Order modified succesfully"
                    });
                   }).catch((err) => {
                    console.log("main err "+ err);
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
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
            
            }
            else{
              res.status(500).json({
                Message: "Insufficient Quantity",
              });
            }
          })
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
      }
exports.cancel_order=(req,res,next)=>{
  Order.find({_id:req.body.orderId})
  .exec()
  .then((result)=>{
    if(result.length >= 1){
      const order = new Order({
        cust_id: '5f228d70e3c8370a249619f2',
        product_id: result[0].product_id,
        overall_price: 50000,
        product_quantity: result[0].quantity,
        status: 'cancelled'
        })
     Order.findOneAndUpdate({orderid:req.body.productName},order)
     .exec()
     .then(result=>{
            return res.status(200).json({
                message: "Ordered cancelled succesfully"
            })
        })
        .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });  
}
else{
  return res.status(200).json({
    message: "Incorrect order id"
})
}
})
.catch((err) => {
  res.status(500).json({
    error: err,
  });
});  
}
exports.view_orders_date=(req,res,next)=>{
    Order.aggregate([
        { $match: {"status":"active"} },
        {
      $group: {
        _id: {
          date: {$dateToString: {format: "%G-%m-%d",date: "$ordered_date"}},
        },
        count: { $sum: 1 }
      }
    }], function (err, result) {
      if (err) {
          console.log(err);
          return;
      }
      else{
        res.send(result)
        console.log(result);
      }
      
  });
}
exports.view_orders_customer=(req,res,next)=>{
  var cust_id=req.params.cid;
    Order.aggregate([
      { $match: {"status":"active","cust_id":cust_id} },
       {$lookup: {from: "users", 
           let:{resultObj:{$toObjectId:"$cust_id"}},
           pipeline:
           [{
               $match:{
                   $expr:{$eq:["$_id","$$resultObj"]}
               }
           }], as: "details"}},
       {
              "$unwind": "$details"
          },{
      $group: {
      _id: {customer_id: "$cust_id",customer_name: "$details.firstname"
                   }
              ,
              product_quantity: { $sum: "$product_quantity" }}},
              {$sort: {"product_quantity":1}}
      ], function (err, result) {
      if (err) {
          console.log(err);
          return;
      }
      else{
        res.send(result)
        console.log(result);
      }    
  });
}
function insert(req,res,order,p_id,p_quantity)
  {
    order
    .save()
    .then((result) => {
      const productQuantity=new ProductQuantity(
        {
          quantity: p_quantity
        }
      )
     
     ProductQuantity.findOneAndUpdate({productId:p_id},productQuantity)
     .exec()
     .then(quantityResult=>{
      res.status(200).json({
        message: 'New Order placed!',
        createdProduct: {
          orderid: result.orderid,
          cust_id: result.cust_id,
          p_id: result.product_id,
          quantity: quantityResult.quantity,
          overall_price: result.overall_price,
          status: 'Active'
        },
      });
     }).catch((err) => {
      console.log("main err "+ err);
      res.status(500).json({
        error: err,
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
  function getResults(queryName, callback) {
    Product.aggregate([
      { "$match": { "$expr": { "$in": [ "$productName", queryName ] } } },
    { "$addFields": { "product_id": { "$toString": "$_id" }}},
      { "$lookup": {
        "from": "productquantities",
        "localField": "product_id",
        "foreignField": "productId",
        "as": "output"
      }},
      {$unwind:"$output"},
      {$group:{
          _id:{
              product_id: "$output.productId",
              quantity: "$output.quantity",
              price: "$price"
              }
          }}
    ], function (err, result) {
      if (err) {
          console.log(err);
          return callback(err, null);
      }
       return callback(null, result);
        
      })
    
  }
