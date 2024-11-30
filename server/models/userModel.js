const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    employeeID: { type: String, required: true, unique: true },
    profileImage: { type: String },
    permissions: [{ type: String, required: true}],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true })

const UserModel = mongoose.model("user", userSchema)

module.exports = UserModel;