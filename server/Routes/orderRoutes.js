var express = require('express');
var router = express.Router();
 var {SaveOrder,GetAllPurchases} = require("../Controllers/orderController");

 router.post('/SaveOrder',SaveOrder);
 router.post('/GetAllPurchases',GetAllPurchases);

module.exports = router;