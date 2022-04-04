const db = require('../Services/db');
const User  = require("../models/userSchema");
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, '/Users/vineetkarmiani/Documents/sjsu/Classes/Sem2/273/Lab1/client/public/images')
    cb(null, '/home/ec2-user/Lab1/client/public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: storage, limits: '50mb' }).single('myImage');
exports.getUserById = async (req,res) => {
      let user = await db.query(`SELECT * FROM Users`);
      req.profile = user;
      return res.json(user);
    //   next();
}

exports.SaveUser = async (req,res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
        return res.json({message: err});
    } else if (err) {
        return res.json({message: "Upload failed"});
    }
    else
    {
      let rowsInserted = await db.query(`UPDATE Users SET Gender = '${req.body.Gender}', ImageName = '${req.file.filename}', Country = '${req.body.Country}', City = '${req.body.City}', BirthdayMonth = '${req.body.BirthdayMonth}', BirthdayYear = '${req.body.BirthdayYear}', About = '${req.body.About}' WHERE UserId = '${req.body.UserId}'`);
      return res.json({message:rowsInserted.affectedRows+" records inserted"});
          //  let rowsInserted =await db.query(`INSERT INTO Items(ShopId,ItemName,ItemDescription,Price, Quantity,ItemImage) VALUES('${req.body.ShopId}','${req.body.Name}','${req.body.Description}','${req.body.Price}','${req.body.Quantity}','${req.file.filename}');`);
          //   return res.json({message:rowsInserted.affectedRows+" records inserted"});
    }
  })
  // let rowsInserted = await db.query(`UPDATE USERS SET Gender = '${req.body.Gender}', UserImage = '${req.body.UserImage}', Country = '${req.body.Country}', City = '${req.body.City}', BirthdayMonth = '${req.body.BirthdayMonth}', BirthdayYear = '${req.body.BirthdayYear}', About = '${req.body.About}' WHERE UserId = '${req.body.UserId}'`);
  // return res.json({message:rowsInserted.affectedRows+" records inserted"});
}

// exports.GetShopOfUser = async (req,res) => {
//   let shop = await db.query(`SELECT ShopId FROM Shop WHERE UserId=${req.body.UserId} LIMIT 1 `);
//   return res.json({shopId : shop});
// }
exports.GetShopOfUser = async (req,res) => {
  let shop = await User.find({_id: req.body.UserId}, 'shop.shopName')
  // let shop = await db.query(`SELECT ShopId FROM Shop WHERE UserId=${req.body.UserId} LIMIT 1 `);
  return res.json({shopName : shop});
}

exports.GetUserImagePath = async (req,res) => {
  let imgPath = await db.query(`SELECT ImageName FROM Users WHERE UserId=${req.body.UserId} LIMIT 1 `);
  return res.json({path : imgPath});
}

