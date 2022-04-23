const User  = require("../models/userSchema");
const Item  = require("../models/itemSchema");
var kafka = require('../kafka/client');

module.exports = {
    getItemsOfShop : async function(req){
           let items = await User.findOne({_id:req.body.UserId},'shop.items')
                            .then((items)=>{
                                return items;
                            })
                            .catch((err)=>{
                                return { error: "No item Found "+err }
                            })
                            return items;
    },

    getAllItemsOfOtherShops : async function(req){
        let items  = await Item.find({owner : {$ne: req.body.UserId}})
        .then((items)=>{
            return items
        })
        .catch((err)=>{
            return { error: "No item Found "+err }
        })
        return items;
    },
    getAllItems : async function(req){
        let items  = await Item.find()
                            .then((items)=>{
                                return items
                            })
                            .catch((err)=>{
                                return { error: "No item Found "+err }
                            })
        return items;
    },
    getAllFavoriteItems : async function(req){
        let items  = await User.findOne({_id : req.body.UserId},"favorite")
                            .then((items)=>{
                                return items
                            })
                            .catch((err)=>{
                                return { error: "No item Found "+err }
                            })
        return items;
    }
}