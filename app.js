var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')



var indexRouter = require('./routes/index');
var UserRouter = require('./routes/User');
var AdminRouter = require('./routes/admin');
var ImageRouter = require('./routes/image');
var withdrawRouter = require('./routes/withdraw');
var paymentMethodRouter = require('./routes/payment_method');
var transactionRouter = require('./routes/transaction');
var addressRouter = require('./routes/address');
var bankRouter = require('./routes/bank');
var couponRouter = require('./routes/coupon');
var eventRouter = require('./routes/event');
var orderRouter = require('./routes/order');
var sliderRouter = require('./routes/slider');
var ticketRouter = require('./routes/ticket');
var ticketSectionRouter = require('./routes/ticket_section');
var ticketImgRouter = require('./routes/ticket_img');
var partnerShipRouter = require('./routes/partner_ship');
var complaintSuggestionRouter = require('./routes/complaint_&_suggestion');
var userCouponRouter = require('./routes/user_coupon');
var whatsappRouter = require('./routes/whatsapp');



var app = express();
app.use(cors())

app.use(cookieParser());
app.use(express.json());

//
// app.use(cors({
//   origin: 'http://localhost:4200'
// }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'Images')));

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req, res, next) {
//   const referer = req.headers.referer;
//   if (referer && referer.indexOf('https://bombticket.com/') === 0) {
//     // Allow the request to continue
//     next();
//   } else {
//     // Reject the request with a 403 Forbidden status code
//     res.sendStatus(403);
//   }
// });






// const allowedIPs = ['64.227.128.140' ,`::ffff:102.189.113.246`]; // replace with your allowed IPs

// app.use((req, res, next) => {
//   const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   console.log(`ipAddress==========>1`,ipAddress);
//   if (allowedIPs.includes(ipAddress)) {
//     // Allow the request to continue
//     next();
//   } else {
//     // Reject the request with a 403 Forbidden status code
//     res.sendStatus(403);
//   }
// });



// app.use((req, res, next) => {
//   // const allowedIPs = ['64.227.128.140'];
//   const clientIP = req.ip;

//   console.log(`clientIP===========>`,clientIP)

//   if (allowedIPs.includes(clientIP)) {
//     next();
//   } else {
//     res.status(403).send('Access denied.');
//   }
// });




const rateLimiter = require("express-rate-limit");
const whatsappLimiter = rateLimiter({
      max: 3,
      windowMS: 100000, //10 seconds
      message: "Too many attempts. Try again later."
  })






app.use('/', indexRouter);
app.use('/admin', AdminRouter);
app.use('/user', UserRouter);
app.use('/transaction', transactionRouter);
app.use('/paymentMethod', paymentMethodRouter);
app.use('/withdraw', withdrawRouter);
app.use('/address', addressRouter);
app.use('/bank', bankRouter);
app.use('/coupon', couponRouter);
app.use('/event', eventRouter);
app.use('/order', orderRouter);
app.use('/slider', sliderRouter);
app.use('/ticket', ticketRouter);
app.use('/ticketSection', ticketSectionRouter);
app.use('/ticketImg', ticketImgRouter);
app.use('/partnerShip', partnerShipRouter);
app.use('/complaintSuggestion', complaintSuggestionRouter);
app.use('/user-coupon', userCouponRouter);
app.use('/image', ImageRouter);
app.use('/whatsapp',whatsappLimiter, whatsappRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




//app.listen(3000, () => {
  //console.log(`Example app listening on port ${3000}`)
//})
 module.exports = app;



