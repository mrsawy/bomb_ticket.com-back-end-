var express = require("express");
var router = express.Router();
const couponController = require('../controller/coupon');

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post('/create', couponController.createCoupon);
router.post('/update/:couponId', couponController.updateCoupon);
router.delete('/del/:couponId', couponController.delCoupon);
router.get('/all-coupon', couponController.allCoupon);
router.get('/coupon/:couponId', couponController.oneCoupon);
router.get('/check-coupon/:couponName', couponController.checkCouponName);

module.exports = router;