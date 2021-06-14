const express = require("express");
const Router = express.Router();
const { User_Signup, User_Signin,User_ForgetPassword,User_ResetPassword } = require("../controller/users_controller");
const Account = require("../Model/users_model");
Router.post("/Signup", User_Signup);
Router.post("/Signin", User_Signin);
Router.post("/ForgetPassword", User_ForgetPassword);
Router.patch("/ResetPassword/:_id", User_ResetPassword);

module.exports = Router;
