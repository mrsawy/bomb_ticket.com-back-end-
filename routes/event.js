var express = require("express");
var router = express.Router();
const eventController = require('../controller/event');
const isAdmin = require('../controller/helper/isAdmin.js');

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post('/create', eventController.createEvent);
router.post('/update/:eventId', eventController.updateEvent);
router.delete('/del/:eventId', eventController.delEvent);
router.get('/all-event', eventController.allEvent);
router.get('/all-event-with-carousel-data', eventController.allEventWithCarouselData);
router.get('/event/:eventId', eventController.oneEvent);

router.get('/all-event-admin', eventController.allEventAdmin);

router.get('/get-detail/:eventId', eventController.getDetail);

module.exports = router;