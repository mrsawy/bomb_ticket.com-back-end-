var express = require("express");
var router = express.Router();
const ticketImgController = require('../controller/ticket_img');

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post('/create', ticketImgController.createTicketImg);
router.post('/update/:ticketImgId', ticketImgController.updateTicketImg);
router.delete('/del/:ticketImgId', ticketImgController.delTicketImg);
router.get('/all-ticket-img', ticketImgController.allTicketImg);
router.get('/ticket-img/:ticketImgId', ticketImgController.oneTicketImg);
router.post('/del-ticket', ticketImgController.delTicketAndImg);

router.post("/update-delete-bulk", ticketImgController.updateDeleteBulkTickets);

module.exports = router;