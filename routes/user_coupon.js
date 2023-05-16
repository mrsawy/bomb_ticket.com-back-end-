var express = require('express');
var router = express.Router();
const userCouponController = require('../controller/user_coupon');


//  Routes & Functions


router.post("/find-coupon", userCouponController.findCoupon);
router.get("/get-all-with-qty", userCouponController.getAllCouponsWithQty);

router.get("/get-all-users-with-coupon/:couponId", userCouponController.getAllUsersWithCoupon);
router.post("/assign-coupon-bulk-users", userCouponController.assignCouponToBulkUsers);
router.post("/unassign-coupon-bulk-users", userCouponController.unassignCouponToBulkUsers);

router.get("/get-user-coupons-with-user-coupon/:userId", userCouponController.getUserCouponsWithUserCoupon);


module.exports = router;
