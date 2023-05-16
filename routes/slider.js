var express = require("express");
var router = express.Router();
const sliderController = require('../controller/slider');

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post('/create', sliderController.createSlider);
router.post('/update/:sliderId', sliderController.updateSlider);
router.delete('/del/:sliderId', sliderController.delSlider);
router.get('/all-slider', sliderController.allSlider);
router.get('/slider/:sliderId', sliderController.oneSlider);

module.exports = router;