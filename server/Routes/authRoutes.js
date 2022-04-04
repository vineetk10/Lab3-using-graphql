var express = require('express');
var router = express.Router();
 var {signup,signin,signout} = require("../Controllers/authController");
 const { check , validationResult } = require('express-validator');
// var {getUserById} = require("../controllers/user");
// const { check , validationResult } = require('express-validator');

// router.param("userId",getUserById);

router.post('/signup',[
    // check("FullName","FullName should be at least 3 characters").isLength({ min: 3 }),
    // check("Email","Email is incorrect").isEmail(),
    // check("UserPassword")
    //     .isLength({ min: 6 })
    //     .withMessage('UserPassword must be at least 6 chars long')
    //     .matches(/\d/)
    //     .withMessage('must contain a number')
],
signup);

router.post('/signin',[
    check("Email","please enter a valid email").isEmail(),
    check("UserPassword")
        .isLength({ min: 1 })
        .withMessage('please enter a password')
],
signin);

router.post('/signout',signout);

module.exports = router;