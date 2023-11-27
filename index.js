const express = require("express");
const public_route = require("./route/public_route");
const auth_route = require("./route/auth_route");
const bodyParser = require("body-parser");
const connection = require("./db/connectionConfig");
const session = require("express-session");
const {verifyJWT} = require("./middleware/validator");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use("/public", session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use("/public/auth/*", verifyJWT);

app.get("/", (req, res) => {
    console.log(connection);
    return res.send("Hello from the server Side!!");
});

app.use("/", public_route);
app.use("/public", auth_route);

app.listen(PORT, () => {
    console.log("You are listening the port :", PORT);
})