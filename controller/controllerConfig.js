const {validationResult } = require('express-validator');
const connection = require("../db/connectionConfig");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


function postReq(req, res) {
    const { username, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "errors": errors.array() });
    }

    const findUser = new Promise((resolve, reject) => {
        connection.execute(
            'SELECT * FROM users WHERE `email` = ?',
            [email],
            function (err, results, fields) {
                if (err) {
                    reject(err);
                }
                resolve(results);
            }
        );
    });

    findUser
        .then((result) => {
            if (result.length == 0) {
                var salt = bcrypt.genSaltSync(10);
                var hashPassword = bcrypt.hashSync(password, salt);
                connection.execute(
                    'INSERT INTO users(username, email, password) VALUES(?, ?, ?)',
                    [username, email, hashPassword],
                    function (err, results, fields) {
                        if (err) {
                            return res.status(500).json({ "title": "Internal Server", error: err });
                        }
                        return res.status(200).json({ "title": "Successfull", message: "Successful registred!" });
                    }
                );
            }
            else {
                return res.status(400).json({ error: "User exists!" });
            }
        })
        .catch(
            (err) => {
                return res.status(500).json({ "title": "Internal Server", error: err });
            }
        )
}

function loginReq(req, res) {
    const {email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "errors": errors.array() });
    }

    const findUser = new Promise((resolve, reject) => {
        connection.execute(
            'SELECT * FROM users WHERE `email` = ?',
            [email],
            function (err, results, fields) {
                if (err) {
                    reject(err);
                }
                resolve(results);
            }
        );
    });

    findUser
        .then((result) => {
            if (result.length > 0) {
                const hashPassword = result[0].password;
                if (bcrypt.compareSync(password, hashPassword)) {
                    const accessToken = jwt.sign({
                        data: req.body,
                    }, 'secret', { expiresIn: 60*60*60 });

                    req.session.autherization = {
                        accessToken, email
                    };
                    return res.status(200).json({ title: "Successful", message: "Successful logged In!!" });
                }
                else {
                    return res.status(400).json({ title: "Error", message: "Logging Error!! wrong password!!!" });
                }
            }
            else {
                return res.status(400).json({ error: "User does not exits! Register First..." });
            }
        })
        .catch(
            (err) => {
                return res.status(500).json({ "title": "Internal Server", error: err });
            }
        )
}

function logOutReq(req, res){
    if(req.session.autherization["accessToken"]){
        req.session.autherization["accessToken"] = null;
        return res.status(200).json({title:"Successful", message:"User logged Out!"});
    }
    else{
        return res.status(403).json({message : "User is not loogged In, Login First"});
    }
}

module.exports = {
    postReq,
    loginReq,
    logOutReq
};