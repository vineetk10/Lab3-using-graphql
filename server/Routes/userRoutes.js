const express = require("express");
const router = express.Router();

const{getUserById,SaveUser,GetUserImagePath} = require("../Controllers/userController")

router.get("/getUser", getUserById);
router.post("/SaveUser", SaveUser);
// router.post("/GetShopOfUser", GetShopOfUser);
router.post('/GetUserImagePath',GetUserImagePath);
module.exports = router;