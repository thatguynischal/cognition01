const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post("/register", async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({message: "Please add all fields"});
    }

    const userExists = await User.findOne({email});
    if (userExists) {
        return res.status(400).json({message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({name, email, password: hashedPassword});

    if (user) {
        res.status(201).json({_id: user.id, name: user.name, email: user.email, status: 'success'});
    } else {
        res.status(400).json({message: "Invalid user data"});
    }
});

loginRouter.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: "Please add all fields"});
    }

    const user = await User.findOne({email});

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "30d"});
        res.json({_id: user.id, name: user.name, email: user.email, token, status: 'success'});
    } else {
        res.status(400).json({message: "Invalid credentials"});
    }
});

module.exports = loginRouter;