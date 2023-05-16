var express = require("express");
var router = express.Router();
const orderController = require('../controller/order');

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post('/create', orderController.createOrder);
router.post('/update/:orderId', orderController.updateOrder);
router.delete('/del/:orderId', orderController.delOrder);
router.get('/all-order', orderController.allOrder);
router.get('/order/:orderId', orderController.oneOrder);
router.get('/order-seller/:sellerId', orderController.sellerOrder);
router.get('/order-user/:userId', orderController.userOrder);
router.get('/get-all-order', orderController.getAllOrder);
router.get('/order-detail/:orderId', orderController.getOrderDetail);

module.exports = router;