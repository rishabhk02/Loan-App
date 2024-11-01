const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
    },
    mobileNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "USER",
        enum: ["ADMIN", "USER"]
    },
    status: {
        type: String,
        default: "ACTIVE",
        enum: ["ACTIVE", "INACTIVE"]
    }
});
const User = mongoose.model("user", userSchema);
module.exports = User;