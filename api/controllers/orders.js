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
        const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        cust_id: '5f228d70e3c8370a249619f2',
        product_id: result[0]._id,
        product_quantity: req.body.quantity,
        overall_price: result[0].price*req.body.quantity,
        ordered_date: new Date(),
        status: 'active'
    })
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
                product_quantity: req.body.quantity,
                status: 'active'
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
  // Order.find()
  // .exec()
  // .then(result=>{
  //   res.send(result);
  //   res.status(200);
  // })
  // .catch((err) => {
  //   res.status(500).json({
  //     error: err,
  //   });
  // }); 
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
    Order.aggregate([
      {
      $group: {
      // _id: {
      //         month: { $month: "$ordered_date" },
      //         day: { $dayOfMonth: "$ordered_date" },
      //         year: { $year: "$ordered_date" }
      //       },
     
          count: { $sum: 1 }
          }
        },
        
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


function insert(req,res,order)
  {
    order
    .save()
    .then((result) => {
     Product.findOneAndUpdate({userName:req.body.productname},p_quantity-req.body.quantity,(quanityResult)=>{
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
  
