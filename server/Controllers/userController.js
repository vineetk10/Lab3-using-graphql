const db = require('../Services/db');
const User  = require("../models/userSchema");
const multer = require('multer');
const {uploadFile} = require('../s3')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Users/vineetkarmiani/Documents/sjsu/Classes/Sem2/273/Lab1/client/public/images')
    // cb(null, '/home/ec2-user/Lab1/client/public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: storage, limits: '50mb' }).single('myImage');

exports.SaveUser = async (req,res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
        return res.json({message: err});
    } else if (err) {
        return res.json({message: "Upload failed"});
    }
    else
    {
      const result = await uploadFile(req.file);
      await User.updateOne({_id:req.body.UserId},{'gender':req.body.Gender,'imagePath':result.Key,'country':req.body.Country,'city':req.body.City,'birthdayMonth':req.body.BirthdayMonth,'birthdayYear':req.body.BirthdayYear,'about':req.body.About})
            .then((user)=>{
              console.log("Updated successfully")
            })
            .catch((err)=>{
              console.log("Updation unsuccessfull "+err)
            })
      return res.json({message:" records inserted"});
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
  let imgPath = await User.find({_id: req.body.UserId}, 'imagePath')
  // let shop = await db.query(`SELECT ShopId FROM Shop WHERE UserId=${req.body.UserId} LIMIT 1 `);
  return res.json({path : imgPath});
}

exports.GetUser = async (req,res) => {
  let user = await User.findOne({_id: req.body.UserId})
  // let shop = await db.query(`SELECT ShopId FROM Shop WHERE UserId=${req.body.UserId} LIMIT 1 `);
  return res.json({user : user});
}

