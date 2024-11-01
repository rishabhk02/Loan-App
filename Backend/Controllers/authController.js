const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
    async signup(req, res) {
        try {
            const { firstName, lastName, mobileNumber, email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            if (!firstName || !lastName || !mobileNumber || !email || !password) {
                return res.status(411).json({ message: "All fields are required" });
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await User.create({
                firstName,
                lastName,
                mobileNumber,
                email,
                password: hashedPassword,
            });
            return res.status(201).json({ message: "User created successfully", user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(411).json({ message: "All fields are required" });
            }
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid Email or Password" });
            }
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRETE_KEY, { expiresIn: "1h" });
            return res.status(200).json({ message: "Login successful", user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, role: user.role, email: user.email, token } });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async validateToken(req, res) {
        try {
            return res.status(200).json({ message: "Token valid", role: req.user.role });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await User.find({ role: "USER" });
            return res.status(200).json({ message: "Users fetched successfully", users });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();