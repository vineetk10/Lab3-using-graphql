
const db = require('../Services/db');
// const multer = require('../multer')
// const upload = require("../multer")
// const upload1 = upload.single('myImage')
const multer = require('multer');
const ItemManager = require('../Manager/itemManager');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/ec2-user/Lab1/client/public/images')
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
               let rowsInserted =await db.query(`INSERT INTO Items(ShopId,ItemName,ItemDescription,Price, Quantity,ItemImage) VALUES('${req.body.ShopId}','${req.body.Name}','${req.body.Description}','${req.body.Price}','${req.body.Quantity}','${req.file.filename}');`);
                return res.json({message:rowsInserted.affectedRows+" records inserted"});
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