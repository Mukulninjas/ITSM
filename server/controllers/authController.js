const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
var jwt = require("jsonwebtoken");
const { emailValidate } = require("../utils/emailValidate");
const logger = require("../services/logger");
const { sendPasswordResetEmail } = require("../services/mailService");
const crypto = require('crypto');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Missing required parameters" });
    }

    const error = emailValidate(email);
    if (error) {
        return res.status(400).send({ message: "Validation errors", error });
    }

    try {
        const user = await UserModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            logger.error(`User with email ${email} is not a member of organization`);
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const { _id: userId, name, role, employeeID, password: hashedPassword, profileImage, permissions } = user;

        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            logger.error(`Invalid credentials for ${email}`);
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const tokenPayload = { email, userId, role, name, employeeID, profileImage, permissions };
        const token = jwt.sign(tokenPayload, process.env.JWT_KEY);
        logger.info(`Login successful for ${email}`);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000
        });
        return res.status(200).send({ message: "Login successful", token });

    } catch (err) {
        logger.error(`Error in login: ${err.message}`);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if(!email){
            return res.status(400).send({ message: "Missing required parameters" });
        }
        const user = await UserModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            logger.error(`User with email ${email} is not a member of organization`);
            return res.status(401).send({ message: "Email Not Found" });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        const resetUrl = `http://${process.env.APP_URL}/reset-password/${email}/${token}`;
        await sendPasswordResetEmail(user, resetUrl);

        return res.status(200).send({ message: "Email Sent Successfully" });

    } catch (err) {
        logger.error(`Error in forgot password: ${err.message}`);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const resetPasswordWithToken = async (req, res) => {
    const {email, token, password} = req.body;
    try {
        if(!email || !token) {
            return res.status(400).send({ message: "Missing required parameters" });
        }
        const user = await UserModel.findOne({ email: email.toLowerCase(), resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()} });
        if(!user) {
            logger.error(`User with email ${email} or token is invalid`);
            return res.status(401).send({ message: "Invalid Token or Email" });
        }
        const hashedPassword = await bcrypt.hash(password, 6);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        logger.info(`Password reset for ${email}`);
        return res.status(200).send({ message: "Password Reset Successful" });
    } catch (error) {
        logger.error(`Error in reseting password: ${err.message}`);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = { login, forgotPassword, resetPasswordWithToken };