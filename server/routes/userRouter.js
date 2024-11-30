const express = require("express");
const userRouter = express.Router();
const { upload } = require("../middleware/storage");
const { uploadImage, removeProfileImage, changePassword, createTicket, postComment } = require("../controllers/userController");
const authenticateJWT = require("../middleware/auth");

userRouter.post('/uploadprofileimage', authenticateJWT, upload.single('image'), uploadImage);
userRouter.get('/removeprofileimage', authenticateJWT, removeProfileImage);
userRouter.post('/changepassword', authenticateJWT, changePassword);
userRouter.post('/createticket', authenticateJWT, createTicket);
userRouter.post('/postcomment', authenticateJWT, postComment);

module.exports = userRouter;