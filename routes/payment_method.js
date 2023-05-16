var express = require("express");
var router = express.Router();
const { PaymentMethod } = require("../database/database.js");
const paymentMethodController = require('../controller/payment_method.js');

/* GET ComplaintAndSuggestion listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create ComplaintAndSuggestion Routes
router.post('/create', paymentMethodController.createPaymentMethod);
router.post('/update/:paymentMethodId', paymentMethodController.updatePaymentMethod);
router.get('/delete/:paymentMethodId', paymentMethodController.deletePaymentMethod);
router.get('/get/:paymentMethodId', paymentMethodController.getPaymentMethod);
router.get('/get-all-by-userId/:userId', paymentMethodController.getAllPaymentMethodsByUserId);
router.get('/get-all', paymentMethodController.getAllPaymentMethods);
module.exports = router;