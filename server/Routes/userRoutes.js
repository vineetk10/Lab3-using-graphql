const express = require("express");
const router = express.Router();

const{SaveUser,GetUserImagePath,GetShopOfUser} = require("../Controllers/userController")

router.post("/SaveUser", SaveUser);
router.post("/GetShopOfUser", GetShopOfUser);
router.post('/GetUserImagePath',GetUserImagePath);
module.exports = router;