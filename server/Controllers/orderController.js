
const db = require('../Services/db');
const User  = require("../Models/userSchema");

exports.SaveOrder = async (req,res) => {
    let orderObj = {"orderDate": Date.now(), "items": req.body.Items}
    await User.updateOne({_id:req.body.UserId}, 
        {"$push":{'orders' : orderObj}})
        .then((docs)=>{
          console.log("Updated Docs : ", docs);
        })
        .catch((err)=>{
          console.log(err)
        })

        return res.json({message:" records inserted"});
    // let orderObj = {"orderDate": Date.now(), "items": req.body.Items}
    // req.body.fn = "SaveOrder";
    // req.body.orderObj = orderObj;
    // kafka.make_request('post_items_1',req.body, function(err,results){
    //   console.log('in result');
    //   console.log(results);
    //   if (err){
    //       console.log("Inside err");
    //       return res.json({"error":err});
    //   }else{
    //       console.log("Inside else");
    //       return res.json({items:results});
    //       }
    //     })
}

exports.GetAllPurchases = async(req,res)=>{
    let orders = await User.findOne({_id: req.body.UserId},"orders")
                        .then((orders)=>{
                            return orders;
                        })
                        .catch((err)=>{
                            console.log(err)
                        })
    return res.json({orders:orders});;
}