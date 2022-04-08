const { check , validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const User  = require("../models/userSchema");

exports.signup = (req,res)=>{

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

exports.signout = (req,res)=>{
    res.clearCookie("token");
    res.json({
        message: "User Signout Successfully"
    })
};