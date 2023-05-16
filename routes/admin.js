var express = require('express');
var router = express.Router();
const adminController = require('../controller/admin.js');
const isAdmin = require('../controller/helper/isAdmin.js');


//  Routes & Functions

router.post("/create",isAdmin, adminController.createAdmin); //
router.post("/update",isAdmin, adminController.updateAdmin); //
router.post("/login", adminController.loginAdmin);
router.delete("/delete/:adminId",isAdmin, adminController.deleteAdmin); //
router.post("/change-password", adminController.changePassword);
router.post("/update-password", adminController.updatePassword);
router.get("/get-one/:adminId", adminController.getOneAdmin); //
router.get("/get-all", adminController.getAllAdmins); //
router.get("/get-percentage", adminController.getPercentage);
router.post("/update-percentage", adminController.setPercentage);


module.exports = router;
