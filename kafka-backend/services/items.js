const Item  = require("../Models/itemSchema");
const User  = require("../Models/userSchema");

async function handle_request(msg, callback){

    console.log("Reached Before "+msg)
    switch(msg.fn){
        case "GetAllItemsOfOtherShops":{
            Item.find({owner : {$ne: msg.UserId}}, (err,res)=>{
                if(err){
                    console.log(err);
                    callback(err,null);
                }
                else{
                    console.log(res);
                    callback(null,res);
                }
        })
            
         console.log("Reached")
         break;
        }
        case "SaveFavItem":{
             await User.updateOne({_id: msg.UserId},{"$push":{'favorite' :msg.Item}})
                .then((item)=>{
                    callback(null,item);
                    console.log("Updated successfully");
                })
                .catch((err)=>{
                    callback(err,null);
                })
                 break;
        }
        case "SaveOrder":{
            await User.updateOne({_id:msg.UserId}, 
                {"$push":{'orders' : msg.orderObj}})
                .then((docs)=>{
                    console.log("Updated Docs : ", docs);
                    callback(null,docs);
                })
                .catch((err)=>{
                    console.log(err)
                    callback(err,null);
                })
             break;
        }
        default:{
            callback(null,null);
        }
    }
     
    //  callback(null, {});
};

exports.handle_request = handle_request;
