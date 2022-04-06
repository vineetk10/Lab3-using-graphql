const { check , validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const User  = require("../models/userSchema");

exports.signup = (req,res)=>{

    // const errors = validationResult(req)

    // if(!errors.isEmpty())
    // {
    //     return res.status(422).json({
    //         error: errors.array()[0].msg
    //     });
    // }
   const user = new User(req.body);
   user.save((err, user)=>{
        if(err){
            return res.status(400).json({
                err: "NOT able to save user in DB"+"Error is"+err
            });
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })    
   });
};

exports.signin = (req,res)=>{
    const {email,password} = req.body;
    // const errors = validationResult(req)

    // if(!errors.isEmpty())
    // {
    //     return res.status(422).json({
    //         error: errors.array()[0].msg
    //     });
    // }

    User.findOne({email},(err,user)=>{
        if(err){
            return res.status(400).json({
                error: "User email does not exists"
            })
        }
        if(!user){
            return res.status(400).json({
                error: "No User Found"
            })
        }
            
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password does not match"
            })
        }

        //create token
        const token = jwt.sign({_id:user._id},process.env.SECRET);

        //put token in cookie
        res.cookie("token",token,{expire: new Date()+9999});
        
        //send response to front end
        const {_id,name,email,role} = user;
        return res.json({user:{_id,token,name,email,role}});
})};

// exports.signup = async (req,res)=>{

//     const errors = validationResult(req)

//     if(!errors.isEmpty())
//     {
//         return res.status(422).json({
//             error: errors.array()[0].msg
//         });
//     }
//     let result = await db.query(`INSERT INTO etsy.Users(FullName,Email,UserPassword) VALUES('${req.body.FullName}', '${req.body.Email}','${req.body.UserPassword}')`);
//     if (result.affectedRows) {
//        return  res.json({'message':`${result.affectedRows} rows afftected`});
//       }

//       return  res.json({'message':'No rows affected'});
// };

// exports.signin = async (req,res)=>{
//     const errors = validationResult(req)

//     if(!errors.isEmpty())
//     {
//         return res.status(422).json({
//             error: errors.array()[0].msg
//         });
//     }
//     let user = await db.query(`SELECT * FROM Users where Email='${req.body.Email}' and UserPassword='${req.body.UserPassword}'`);
//     if(user.length==0)
//         return res.status(400).json({
//             error: "Incorrect Email or Password"
//         })
//     console.log(user[0].UserId);
//      const token = jwt.sign({"id":user[0].UserId},process.env.SECRET);
//      res.cookie("token",token,{expire: new Date()+9999});
        
//     //send response to front end
//     const {UserId,FullName,Email,UserPassword,ShopId} = user[0];
//     return res.json({user:{token,UserId,FullName,Email,UserPassword,ShopId}});
// };

exports.signout = (req,res)=>{
    res.clearCookie("token");
    res.json({
        message: "User Signout Successfully"
    })
};