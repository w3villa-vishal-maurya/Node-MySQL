const public_route = require("express").Router();
const {postReq} = require("../controller/controllerConfig");
const {bodyValidateReg} = require("../middleware/validator");

public_route.post("/register",
    bodyValidateReg,
    postReq
);

module.exports = public_route;



