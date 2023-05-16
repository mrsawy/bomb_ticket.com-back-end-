var express = require("express");
var router = express.Router();
const partnerShipController = require('../controller/partner_ship');

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post('/create', partnerShipController.createPartnerShip);
router.post('/update/:partnerShipId', partnerShipController.updatePartnerShip);
router.delete('/del/:partnerShipId', partnerShipController.delPartnerShip);
router.get('/all-partnerShip', partnerShipController.allPartnerShip);
router.get('/partnerShip/:partnerShipId', partnerShipController.onePartnerShip);

module.exports = router;