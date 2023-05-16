var express = require("express");
var router = express.Router();
const withDrawController = require("../controller/withdraw");

router.post("/create/:userId", withDrawController.createWithdraw);
router.post("/pay-to-provider/:withdrawId", withDrawController.payToUser);
router.post("/update/:withdrawId", withDrawController.updateWithdraw);
router.post("/delete/:id", withDrawController.deleteWithdraw);
router.get("/get/:withdrawId", withDrawController.getWithdraw);
router.get("/get-all/:userId", withDrawController.getWithdrawByUser);
router.get("/all-paid", withDrawController.getAllPaid);
router.get("/all-unpaid", withDrawController.getAllUnpaid);
router.get("/my-wallet-data/:userId", withDrawController.myWalletData);
router.get("/all-paid-admin", withDrawController.getAllPaidAdmin);
router.get("/all-unpaid-admin", withDrawController.getAllUnpaidAdmin);

module.exports = router;
