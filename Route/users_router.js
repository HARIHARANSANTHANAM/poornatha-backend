const express = require("express");
const Router = express.Router();
const { User_Signup, User_Signin } = require("../controller/users_controller");
const Account = require("../Model/users_model");
Router.post("/Signup", User_Signup);
Router.get("/Signin", User_Signin);

module.exports = Router;
