
const db = require('../Services/db');
// const multer = require('../multer')
// const upload = require("../multer")
// const upload1 = upload.single('myImage')
const multer = require('multer');
const ItemManager = require('../Manager/itemManager');
const User  = require("../models/userSchema");
const Item  = require("../models/itemSchema");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, '/home/ec2-user/Lab1/client/public/images')
    cb(null, '/Users/vineetkarmiani/Documents/sjsu/Classes/Sem2/273/Lab1/client/public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage, limits: '50mb' }).single('myImage');

exports.SaveItem = async (req,res) => {
      upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.json({message: err});
        } else if (err) {
            return res.json({message: "Upload failed"});
        }
        else
        {
              let newItemObj = {"owner":req.body.UserId,"itemName":req.body.Name,"itemDescription":req.body.Description,"price":req.body.Price,"quantity":req.body.Quantity,"itemImageUrl":req.file.filename};
              let item = new Item(newItemObj);
              let itemId = await item.save()
                            .then((item)=>{
                              return item._id;
                            })
                            .catch((err)=>{
                              return res.status(400).json({
                                err: "NOT able to save item in DB"+"Error is"+err
                            });
                            })
           
              let newItem = {"itemId":itemId,"itemName":req.body.Name,"itemDescription":req.body.Description,"price":req.body.Price,"quantity":req.body.Quantity,"itemImageUrl":req.file.filename};
              User.updateOne({_id:req.body.UserId}, 
                {"$push":{'shop.items' :newItem}},)
                .then((docs)=>{
                  console.log("Updated Docs : ", docs);
                })
                .catch((err)=>{
                  console.log(err)
                })
             
                return res.json({message:" records inserted"});
        }
      })
     
   
}

exports.EditItem = async (req,res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
        return res.json({message: err});
    } else if (err) {
        return res.json({message: "Upload failed"});
    }
    else
    {
        let rowsInserted =await db.query(`UPDATE Items SET ItemName='${req.body.Name}',ItemDescription = '${req.body.Description}' ,Price = '${req.body.Price}', Quantity = '${req.body.Quantity}' WHERE ItemId = ${req.body.ItemId}`);
        return res.json({message:rowsInserted.affectedRows+" records inserted"});
    }
  })
 

}

exports.GetItemsOfShop = async (req,res) => {
    let items = await ItemManager.getItemsOfShop(req);
    return res.json({items:items});
}

exports.GetAllItemsOfOtherShops = async (req,res) => {
    let items = await ItemManager.getAllItemsOfOtherShops(req);
    return res.json({items:items});
}
exports.GetAllItems = async (req,res) => {
  let items = await ItemManager.getAllItems(req);
  return res.json({items:items});
}
exports.GetAllFavoriteItems = async (req,res) => {
  let items = await ItemManager.getAllFavoriteItems(req);
  return res.json({items:items});
}

exports.SaveFavItem = async (req,res) => {
    let rowsInserted = await db.query(`INSERT INTO UserItem(UserId,ItemId,IsFavorite) VALUES('${req.body.UserId}','${req.body.ItemId}',true);`);
    return res.json({message:rowsInserted.affectedRows+" records inserted"});
}

exports.RemoveFavItem = async (req,res) => {
    let rowsInserted = await db.query(`DELETE FROM UserItem where UserId='${req.body.UserId}' and  ItemId='${req.body.ItemId}'`);
    return res.json({message:rowsInserted.affectedRows+" records inserted"});
}