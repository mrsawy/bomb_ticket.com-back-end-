var express = require("express");
var router = express.Router();
const ticketSectionController = require('../controller/ticket_section');

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post('/create', ticketSectionController.createTicketSection);
router.post('/update/:ticketSectionId', ticketSectionController.updateTicketSection);
router.delete('/del/:ticketSectionId', ticketSectionController.delTicketSection);
router.get('/all-ticket-section', ticketSectionController.allTicketSection);
router.get('/all-ticket-section-event/:eventId', ticketSectionController.allTicketSectionByEvent);
router.get('/ticket-section/:ticketSectionId', ticketSectionController.oneTicketSection);

module.exports = router;