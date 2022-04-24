var express = require('express');
var router = express.Router();
 var {EditShop,GetAllItems,GetItemsOfShop,SaveItem,GetAllItemsOfOtherShops,SaveFavItem,RemoveFavItem,GetAllFavoriteItems,EditItem} = require("../Controllers/itemController");
//  const { checkAuth } = require("../utils/passport");
//  const { auth } = require("../utils/passport");
//  auth();
var {checkAuth} = require('../Utils/passport')
 router.post('/SaveItem',SaveItem);
 router.post('/EditItem',EditItem);
 router.post('/EditShop',EditShop);
 router.post('/GetItemsOfShop',GetItemsOfShop);
 router.post('/GetAllItemsOfOtherShops',GetAllItemsOfOtherShops);
 router.post('/GetAllItems',GetAllItems);
 router.post('/GetAllFavoriteItems',checkAuth(),GetAllFavoriteItems);
 router.post('/SaveFavItem',SaveFavItem);
 router.post("/RemoveFavItem",RemoveFavItem);
module.exports = router;