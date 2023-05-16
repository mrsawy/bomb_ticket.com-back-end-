var express = require("express");
var router = express.Router();
const transactionController = require('../controller/transaction');

/* GET ComplaintAndSuggestion listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create ComplaintAndSuggestion Routes
router.get('/all-transaction/:userId', transactionController.allTransaction);

module.exports = router;