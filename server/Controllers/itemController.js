
const db = require('../Services/db');
// const multer = require('../multer')
// const upload = require("../multer")
// const upload1 = upload.single('myImage')
const multer = require('multer');
const ItemManager = require('../Manager/itemManager');
const User  = require("../Models/userSchema");
const Item  = require("../Models/itemSchema");
const {uploadFile} = require('../s3')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/ec2-user/Lab2/client/public/images')
    // cb(null, '/Users/vineetkarmiani/Documents/sjsu/Classes/Sem2/273/Lab1/client/public/images')
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
            return res.json({message: "Upload failed "+err});
        }
        else
        {
              const result = await uploadFile(req.file);
              console.log(result);
              let newItemObj = {"owner":req.body.UserId,"itemName":req.body.Name,"itemDescription":req.body.Description,"price":req.body.Price,"quantity":req.body.Quantity,"itemImageUrl":result.Key};
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
              await User.updateOne({_id:req.body.UserId}, 
                {"$push":{'shop.items' :newItem}},)
                .then((docs)=>{
                  console.log("Updated Docs : ", docs);
                })
                .catch((err)=>{
                  console.log(err)
                })
             
                return res.send({imagePath: `/images/${result.Key}`});
        }
      })
     
   
}

exports.EditShop = async (req,res)=>{
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
        return res.json({message: err});
    } else if (err) {
        return res.json({message: "Upload failed"});
    }
    else
    {
          const result = await uploadFile(req.file);
          console.log(result);
          await User.updateOne({_id:req.body.UserId}, {'shop.shopImageUrl': result.Key})
          .then((item)=>{
            console.log("Edit successful");
          })
          .catch((err)=>{
            console.log("Edit failed "+err);
          })
          return res.json({message: "Upload sucessfull"});;
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
        await Item.updateOne({_id:req.body.ItemId},{"itemName":req.body.Name, "itemDescription" : req.body.Description,"price" : req.body.Price, "quantity" : req.body.Quantity})
              .then((item)=>{
                console.log("Edit successful");
              })
              .catch((err)=>{
                console.log("Edit failed "+err);
              })
        await User.updateOne({_id:req.body.UserId, 'shop.items.itemId': req.body.ItemId}, {'shop.items.$.price' : req.body.Price,'shop.items.$.itemName':req.body.Name, 'shop.items.$.itemDescription' : req.body.Description,'shop.items.$.quantity' : req.body.Quantity})
        .then((item)=>{
          console.log("Edit successful");
        })
        .catch((err)=>{
          console.log("Edit failed "+err);
        })
        return res.json({message: "Upload sucessfull"});;
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
    // req.body.fn = "GetAllItemsOfOtherShops";
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
exports.GetAllItems = async (req,res) => {
  let items = await ItemManager.getAllItems(req);
  return res.json({items:items});
}
exports.GetAllFavoriteItems = async (req,res) => {
  let items = await ItemManager.getAllFavoriteItems(req);
  return res.json({items:items});
}

exports.SaveFavItem = async (req,res) => {

  await User.updateOne({_id: req.body.UserId},{"$push":{'favorite' :req.body.Item}})
    .then((item)=>{
      console.log("Updated successfully");
    })
    .catch((err)=>{
      console.log("Updation Failed");
    })
    // let rowsInserted = await db.query(`INSERT INTO UserItem(UserId,ItemId,IsFavorite) VALUES('${req.body.UserId}','${req.body.ItemId}',true);`);
    return res.json({message:" records inserted"});
  // req.body.fn = "SaveFavItem";
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

exports.RemoveFavItem = async (req,res) => {
    await User.updateOne({_id: req.body.UserId},{"$pull":{'favorite' :{_id:req.body.ItemId}}})
          .then((item)=>{
            console.log("Deleted successfully");
          })
          .catch((err)=>{
            console.log("Deletion Failed");
          })
    return res.json({message:" records inserted"});
}