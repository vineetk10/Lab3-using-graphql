const express = require("express");
const router = express.Router();

const{SaveUser,GetUserImagePath,GetShopOfUser,GetUser} = require("../Controllers/userController")

router.post("/SaveUser", SaveUser);
router.post("/GetShopOfUser", GetShopOfUser);
router.post('/GetUserImagePath',GetUserImagePath);
router.post('/GetUser',GetUser);
module.exports = router;