
const db = require('../Services/db');
const User  = require("../models/userSchema");

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
    // let sql_string = `Select ItemImage, ItemName, Quantity, Price,ShopName, OrderDate
    // From Orders o inner join OrderDetails od on o.OrderId = od.OrderId
    // inner join Items i on i.ItemId=od.ItemId
    // Inner JOIN Shop s on i.ShopId=s.ShopId
    // where o.UserId=${req.body.UserId}`;
    // let purchases =await db.query(sql_string);
    // return res.json({purchases:purchases});
}