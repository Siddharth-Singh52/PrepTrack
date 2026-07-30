const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {

    const { name, email, password } = req.body;
    
    // chaeck if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please provide all fields"
        });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if(existingUser) {
        return res.status(400).json({
            message: "User already exist"
        });
    }

    // Check if password is at least 8 characters long
    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
        name,
        email,
        password : hashedPassword
    });

    res.status(201).json({
        message: "User Registered Successfully",
        token: generateToken(newUser._id),
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        }
    });

};

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide email and password"
        });
    }

    const user = await User.findOne({
        email
    });

    if (!user) {
        return res.status(400).json({
            message: "User not found"
        });
    }

    // Check if password entered by user during login is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password"
        });
    }

    res.status(200).json({
        message: "User logged in successfully",
        token: generateToken(user._id),
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
        }
    });

};

module.exports = {
    registerUser,
    loginUser
};