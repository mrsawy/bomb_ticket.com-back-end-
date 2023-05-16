var express = require("express");
var router = express.Router();
// const { User } = require("../database/database.js");
const userController = require('../controller/User.js');
const uploadController = require('../controller/upload-controller');
const isAdmin = require('../controller/helper/isAdmin.js');



const rateLimiter = require("express-rate-limit");
const whatsappLimiter = rateLimiter({
      max: 3,
      windowMS: 100000, //10 seconds
      message: "Too many attempts. Try again later."
  })

/* GET User listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create user Routes
router.post('/register', userController.registerUser);
router.post('/sign-in', userController.signInUser);
router.post('/is-user-exist', userController.isUserExist);
router.post('/change-password/:userId', userController.changePassword);
router.post('/update-password/:userId', userController.updatePassword);
router.delete('/delete/:userId', userController.deleteUser);
router.get('/all-user',isAdmin, userController.allUser);
router.get('/one-user/:userId', userController.oneUser);
router.post('/update-user/:userId', userController.updateUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/block-user/:userId', userController.blockUser);
router.get('/check-block-unblock/:userId', userController.checkBlockUnblock);
router.get('/get-dashBoard-data/:userId', userController.dashBoard);
router.get('/get-provider-data/:userId', userController.providerData);
router.get('/get-dashBoard-data-by-seller/:userId', userController.dashBoardBySeller);
router.post('/update-iBan/:userId', userController.updateIBan);
router.post('/send-otp', whatsappLimiter,userController.sendOtp);
router.post('/verify-otp', userController.verifyOtp);

// router.post('/is-user-exist', userController.isUserExist);


// router.post('/check-exist', userController.checkExist);


router.post('/upload-files', uploadController.uploadFiles);

router.post('/mark-disclaimer/:userId', userController.markUserDisclaimer);

module.exports = router;