const mongoose = require('mongoose');
const modelSchema = new mongoose.Schema({
	
	"driverId":{
        "type" :"String"
    },
	"status": {
        "type" :"String"
    },
	"dateOfBirth": {
        "type" :"String"
    },
	"name": {
        "type" :"String"
    },
	"gender": {
        "type" :"String"
    },
	"contactInfo":{
        "type" :"Object"
    },
	"emergencyContactInfo": {
        "type" :"Object"
    },
	"addressDetails": {
        "type" :"Object"
    },
	"licenseDetails": {
        "type" :"Object"
    },
	"associatedWith": [{
        "type" :"Object"
    }],
	"fleetMapping": [{
        "type" :"Object"
    }],
	"lanePreferences": [{
        "type" :"Object"
    }],
	"preferredShiftTiming": {
       "monday":{"type" :"Object"},
       "tuesday":{"type" :"Object"},
       "wednesday":{"type" :"Object"},
       "thursday":{"type" :"Object"},
       "friday":{"type" :"Object"},
       "saturday":{"type" :"Object"},
       "sunday":{"type" :"Object"}
        
	},
	"companyId": {
        "type" :"String"
    },
	"password": {
        "type" :"String"
    },
	"isVerified": {
        "type" :"String"
    }
});

const driver = mongoose.model('driver',modelSchema,'driver');
module.exports = driver;