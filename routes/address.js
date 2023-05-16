var express = require("express");
var router = express.Router();
const addressController = require('../controller/address');

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post('/create', addressController.createAddress);
router.post('/update/:addressId', addressController.updateAddress);
router.delete('/del/:addressId', addressController.delAddress);
router.get('/all-address', addressController.allAddress);
router.get('/address/:addressId', addressController.oneAddress);

module.exports = router;