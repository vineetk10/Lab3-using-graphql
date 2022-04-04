var express = require('express');
var router = express.Router();
 var {CheckAvailability,SaveShop} = require("../Controllers/shopController");

 router.post('/CheckAvailability',CheckAvailability);
 router.post('/SaveShop',SaveShop);
module.exports = router;