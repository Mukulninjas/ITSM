const UserModel = require('../models/userModel');
const logger = require("../services/logger");
const bcrypt = require("bcrypt");
const { sendOnboardingEmail } = require('../services/mailService');

const createUser = async (req, res) => {
    try {
        if (req.user.role == "admin") {
            const { name, email, password, role, employeeID, permissions } = req.body;
            if (!name || !email || !password || !role || !employeeID || !permissions) {
                return res.status(400).send({ message: "Missing required parameters" });
            }
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).send({ message: "An account with this email already exists" });
            }
            bcrypt.hash(password, 6, async (err, hash) => {
                if (err) {
                    logger.error(`Can not hash password ${password} ${err.message}`);
                    return res.status(500).send({ message: "Unable to create user account at this time. Please try again later.", });
                }
                const user = new UserModel({ name, email: email.toLowerCase(), password: hash, role, employeeID, permissions });
                await user.save();
                logger.info(`User created with email ${email} by ${user.email}`);
                await sendOnboardingEmail(user);
                return res.status(201).send({ message: "User created successfully" });
            });
        }else {
            return res.status(403).send({ message: "You are not allowed to create a user account at this time. Please try again later"});
        }
    } catch (error) {
        logger.error(`Error in creating user ${error.message}`);
        res.status(500).send({ message: "Unable to create user account at this time. Please try again later." });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (req.user.role == "admin") {
            const { email } = req.body;
            if (!email) {
                return res.status(400).send({ message: "Missing required parameters" });
            }
            const user = await UserModel.findOneAndDelete({ email: email.toLowerCase() });
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            logger.info(`User deleted with email ${email} by ${req.user.email}`);
            return res.status(200).send({ message: "User deleted successfully" });
        }else {
            return res.status(403).send({ message: "You are not allowed to delete a user account at this time. Please try again later"});
        }
    } catch (error) {
        logger.error(`Error in deleting user ${error.message}`);
        res.status(500).send({ message: "Unable to delete user account at this time. Please try again later." });
    }
};

const editUser = async (req, res) => {
    try {
        if (req.user.role == "admin") {
            const { name, email, role, employeeID, permissions } = req.body;
            if (!name || !email || !role || !employeeID) {
                return res.status(400).send({ message: "Missing required parameters" });
            }
            const user = await UserModel.findOneAndUpdate({ email: email.toLowerCase() }, { name, email, role, employeeID, permissions });
            if (!user) {
                return res.status(400).send({ message: "No user found with the following details" });
            }
            logger.info(`User updated with email ${email} by ${req.user.email}`);
            return res.status(200).send({ message: "User updated successfully" });
        }else {
            return res.status(403).send({ message: "You are not allowed to create a user account at this time. Please try again later"});
        }
    } catch (error) {
        logger.error(`Error in editing user ${error.message}`);
        res.status(500).send({ message: "Unable to edit user account at this time. Please try again later." });
    }
};

const listUsers = async (req, res) => {
    try {
        if(req.user.role === 'admin'){
            const users = await UserModel.find();
            return res.status(200).json({ users });
        }else {
            return res.status(403).send({ message: "You are not allowed to access the list of users. Please try again later"});
        }
    } catch (error) {
        logger.error(`Error in getting user list: ${error.message}`);
        res.status(500).send({ message: "Unable to get the list of users." });   
    }
};

module.exports = { createUser, deleteUser, editUser, listUsers };