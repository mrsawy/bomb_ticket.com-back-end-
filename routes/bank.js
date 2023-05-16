var express = require("express");
var router = express.Router();
const bankController = require('../controller/bank');
const isAdmin = require('../controller/helper/isAdmin.js');


router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post('/create', bankController.createBank);
router.post('/update/:bankId', bankController.updateBank);
router.delete('/del/:bankId', bankController.delBank);
router.get('/all-bank',isAdmin, bankController.allBank);
router.get('/bank/:bankId', bankController.oneBank);
router.get('/check-bank-info/:bankId', bankController.userBankInfo);
router.get('/get-by-user/:userId', bankController.getByUser);

module.exports = router;