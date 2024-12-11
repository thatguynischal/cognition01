import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import User from '../models/user.js';
import helpers from '../utils/helpers.js';

const loginRouter = Router();

loginRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return helpers.sendResponse(res, "error", 400, "Please add all fields");
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return helpers.sendResponse(res, "error", 400, "User already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({ name, email, password: hashedPassword });

        if (user) {
            return helpers.sendResponse(res, "success", 201, "User created successfully", {
                _id: user.id,
                name: user.name,
                email: user.email,
            });
        } else {
            return helpers.sendResponse(res, "error", 400, "Invalid user data");
        }
    } catch (error) {
        console.error(error);
        return helpers.sendResponse(res, "error", 500, "Server error");
    }
});

// Login route
loginRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
        return helpers.sendResponse(res, "error", 400, "Please add all fields");
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if the password is correct
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
            return helpers.sendResponse(res, "success", 200, "Login successful", {
                _id: user.id,
                name: user.name,
                email: user.email,
                token,
            });
        } else {
            return helpers.sendResponse(res, "error", 400, "Invalid credentials");
        }
    } catch (error) {
        console.error(error);
        return helpers.sendResponse(res, "error", 500, "Server error");
    }
});

export default loginRouter;