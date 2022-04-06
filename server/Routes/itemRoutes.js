var express = require('express');
var router = express.Router();
 var {GetAllItems,GetItemsOfShop,SaveItem,GetAllItemsOfOtherShops,SaveFavItem,RemoveFavItem,GetAllFavoriteItems,EditItem} = require("../Controllers/itemController");

 router.post('/SaveItem',SaveItem);
 router.post('/EditItem',EditItem);
 router.post('/GetItemsOfShop',GetItemsOfShop);
 router.post('/GetAllItemsOfOtherShops',GetAllItemsOfOtherShops);
 router.post('/GetAllItems',GetAllItems);
 router.post('/GetAllFavoriteItems',GetAllFavoriteItems);
 router.post('/SaveFavItem',SaveFavItem);
 router.post("/RemoveFavItem",RemoveFavItem);
module.exports = router;