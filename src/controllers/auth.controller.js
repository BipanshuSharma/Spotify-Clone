const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

async function registerUser(req, res) {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isUserAlreadyExist) {
        return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        role
    });

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, JWT_SECRET);

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    });

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

async function loginUser(req, res) { 
    const{username, password ,email} = req.body;

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if(!user){
        return res.status(401).json({message: "Invalid username or email"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({message: "Invalid password"});
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, JWT_SECRET);

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    });

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

module.exports = { registerUser, loginUser };