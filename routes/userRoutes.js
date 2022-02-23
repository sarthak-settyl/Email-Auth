const express = require("express");
const {
    validateUser, 
    verifypassword, 
    updatepassword, 
    updateTimeZone,
    verifyOtp, 
    userAuthentication
    // createManyUsers
} = require("../controllers/user");
const router = express.Router();

router.post('/validateUser',validateUser);

router.post('/verifypassword',verifypassword);

router.post('/updatepassword',updatepassword);

router.post('/updateTimeZone',updateTimeZone);

router.post('/verifyOtp',verifyOtp);
router.post('/userAuthentication',userAuthentication);
module.exports = router;

