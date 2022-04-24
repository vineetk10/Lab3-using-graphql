const db = require('../Services/db');
const ShopManager = require('../Manager/shopManager');
const User  = require("../Models/userSchema");

exports.CheckAvailability = async (req,res) => {
      let isAvailable = await ShopManager.checkAvailability(req);
      return isAvailable ? res.json({isAvailable:true}) : res.json({isAvailable:false});
}

exports.SaveShop = async (req,res) => {
      User.updateOne({_id:req.body.userId}, 
            {'shop.shopName' :req.body.shopName}, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Updated Docs : ", docs);
            }
        });
        return res.json({result:"Update successfull"});
}

