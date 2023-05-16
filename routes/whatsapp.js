var express = require("express");
var router = express.Router();
const whatsappController = require(`./../controller/whatsapp`)

router.post("/send", whatsappController.sendWhatsapp);
router.post("/send-to-seller-by-id", whatsappController.sendToSellerById);
router.post("/send-after-payment", whatsappController.sendAfterPayment);
router.post("/send-to-seller-after-approval", whatsappController.sendToSellerAfterApproval);
router.post("/send-to-seller-after-rejection", whatsappController.sendToSellerAfterRejection);






// router.get("/whatsapp/send", withDrawController.getAllUnpaidAdmin);

module.exports = router;
