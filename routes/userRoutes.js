const express = require("express");
const {
    validateUser, 
    verifypassword, 
    updatepassword, 
    updateTimeZone,
    verifyOtp, 
    // createManyUsers
} = require("../controllers/user");
const router = express.Router();

router.post('/validateUser',validateUser);

router.post('/verifypassword',verifypassword);

router.post('/updatepassword',updatepassword);

router.post('/updateTimeZone',updateTimeZone);

router.post('/verifyOtp',verifyOtp);
module.exports = router;

