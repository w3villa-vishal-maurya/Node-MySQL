const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

const bodyValidateReg = [
    body('username').notEmpty(),
    body('password').isLength({ min: 6 }),
    body('email').isEmail()
];

const bodyValidateLogin = [
    body('password').isLength({ min: 6 }),
    body('email').isEmail()
];


function verifyJWT(req, res, next){
    if(req.session.autherization){
        token = req.session.autherization["accessToken"];
        jwt.verify(token, "secret", (err, user)=>{
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message : "User is not authorized"});
            }
        })
    }
    else{
        return res.status(403).json({message: "User not logged In."})
    }
}

module.exports = {
    bodyValidateReg,
    bodyValidateLogin,
    verifyJWT
};