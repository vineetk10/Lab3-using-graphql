const Item  = require("../Models/itemSchema");
const User  = require("../../server/models/userSchema");

async function handle_request(msg, callback){

    console.log("Reached Before "+msg)
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
    //  callback(null, {});
};

exports.handle_request = handle_request;
