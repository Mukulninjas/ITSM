const express = require("express");
const authRouter = express.Router();
const { login, forgotPassword, resetPasswordWithToken } = require("../controllers/authController");

authRouter.post("/login", login);
authRouter.post("/forgotpassword",forgotPassword);
authRouter.post("/resetpasswordwithtoken", resetPasswordWithToken);

module.exports = authRouter;