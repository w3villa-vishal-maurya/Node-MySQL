const auth_route = require("express").Router();
const {bodyValidateLogin} = require("../middleware/validator");
const {loginReq, logOutReq} = require("../controller/controllerConfig");



auth_route.post("/login", bodyValidateLogin, loginReq)


auth_route.get("/auth/profile", (req, res)=>{
    return res.status(200).json({"title":"Profile", message: req.user.data});
});


auth_route.get("/auth/logout", logOutReq);

module.exports = auth_route;