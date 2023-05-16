var express = require("express");
var router = express.Router();
const ticketController = require("../controller/ticket");
const isAdmin = require('../controller/helper/isAdmin.js');


router.get("/", function (req, res, next) {
  console.log(`/ticket function works fine`);
  res.send("respond with a resource");
});

router.post(
  "/create",
  (req, res, next) => {
    console.log(`meduim function=====================>`);
    next();
  },
  ticketController.createTicket
);
router.post("/update/:ticketId", ticketController.updateTicket);
router.post("/creatUser", ticketController.createUserName);
router.delete("/del/:ticketId", ticketController.delTicket);
router.get("/all-ticket", ticketController.allTicket);
router.get("/ticket/:ticketId", ticketController.oneTicket);
router.get("/all-pending", ticketController.allPending);  //
router.get("/all-approved", ticketController.allApproved);  //
router.get("/all-sold",ticketController.allSold);             //
router.get("/all-rejected", ticketController.allRejected);     //
router.get(
  "/all-ticket-pending-approved-rejected/:sellerId",
  ticketController.ticketPendingApprovedRejected
);

module.exports = router;
