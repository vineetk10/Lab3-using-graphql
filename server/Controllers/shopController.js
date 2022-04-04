const db = require('../Services/db');
const ShopManager = require('../Manager/shopManager');

exports.CheckAvailability = async (req,res) => {
      let isAvailable = await ShopManager.checkAvailability(req);
      return isAvailable ? res.json({isAvailable:true}) : res.json({isAvailable:false});
}

exports.SaveShop = async (req,res) => {
      await db.query(`INSERT INTO Shop(ShopName,UserId) VALUES('${req.body.shopName}','${req.body.userId}');`);
      let id = await db.query(`SELECT ShopId FROM Shop where ShopName="${req.body.shopName}"`);
      // await db.query(`Update Users SET ShopId = '${id[0].ShopId}' where UserId=${req.body.userId};`);
      return id==null ? res.json({shopId:false}) : res.json({shopId: id});
}

