var express = require("express");
var router = express.Router();
const ComplaintAndSuggestionController = require('../controller/complaint_&_suggestion');

/* GET ComplaintAndSuggestion listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create ComplaintAndSuggestion Routes


router.post('/create', ComplaintAndSuggestionController.createComplaintAndSuggestion);
router.delete('/delete/:complainSuggestionId', ComplaintAndSuggestionController.deleteComplainAndSuggestion);
router.get('/all-ComplaintAndSuggestion', ComplaintAndSuggestionController.allComplaintAndSuggestion);
module.exports = router;