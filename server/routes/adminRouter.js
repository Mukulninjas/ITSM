const express = require("express");
const adminRouter = express.Router();
const authenticateJWT = require("../middleware/auth");
const { createUser, deleteUser, editUser, listUsers } = require("../controllers/adminController");

adminRouter.post('/createuser', authenticateJWT, createUser);
adminRouter.post('/deleteuser', authenticateJWT, deleteUser);
adminRouter.put('/edituser', authenticateJWT, editUser);
adminRouter.get('/users', authenticateJWT, listUsers);

module.exports = adminRouter;