const db = require('../Services/db');
const db1 = require('../Services/db1');
const User  = require("../models/userSchema");
module.exports = {
    getItemsOfShop : async function(req){
        User.find({_id:'req.body.UserId'},'shop', function (err, items) {
            if (err) 
                return { error: "No item Found "+err }
            return items
          })
    },

    getAllItemsOfOtherShops : async function(req){
        User.find({_id:'req.body.UserId'},'items', function (err, items) {
            if (err) 
                return { error: "No item Found "+err }
            return items
          })
    },
    getAllItems : async function(req){
        User.find({},'items', function (err, items) {
            if (err) 
                return { error: "No item Found "+err }
            return items
          })
    },
    getAllFavoriteItems : async function(req){
        let items = await db.query(`select * from Items i inner join UserItem ui on i.ItemId=ui.ItemId where ui.UserId = ${req.body.UserId}`);
        return items;
    }
}