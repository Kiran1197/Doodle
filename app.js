const express = require('express');
const app = express();
//const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
const productRoute = require('./api/routes/productRoute');
const userRoutes = require('./api/routes/userRoute');
const orderRoutes= require('./api/routes/orderRoute');

mongoose.connect('mongodb://localhost:27017/customer_details',()=>{
    console.log("db connected");
});
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  bodyParser.json({
    'Content-Type': '*/*',
  })
);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type',
    'Authorization'
  );
  next();
});

app.use('/products', productRoute);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
