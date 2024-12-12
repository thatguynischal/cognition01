import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {Router} from 'express';
import nodemailer from 'nodemailer';
import {v4 as uuidv4} from 'uuid';
import User from '../models/user.js';
import UserVerification from "../models/userVerification.js";
import helpers from '../utils/helpers.js';

const loginRouter = Router();

//Nodemailer Stuff
let transporter = nodemailer.createTransport({
    service: 'gmail', auth: {
        user: process.env.AUTH_EMAIL, pass: process.env.AUTH_PASS
    }
})

//testing success
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
})

loginRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return helpers.sendResponse(res, "error", 400, "Please add all fields");
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return helpers.sendResponse(res, "error", 400, "User already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({name, email, password: hashedPassword, verified: false});

        // Generate unique string and expiration time
        const uniqueString = uuidv4();
        const createdAt = new Date();
        const expiresAt = new Date(createdAt);
        expiresAt.setHours(expiresAt.getHours() + 24); // Token valid for 24 hours

        // Create verification entry
        await UserVerification.create({
            userId: user._id, uniqueString, createdAt, expiresAt,
        });

        // Send verification email
        const verificationUrl = `${process.env.FRONTEND_URL}/verify/${uniqueString}`;
        await transporter.sendMail({
            to: email,
            subject: "Email Verification",
            html: `<p>Please click <a href="${verificationUrl}">here</a> to verify your account.</p>`
        });

        return helpers.sendResponse(res, "success", 201, "User created successfully. Please check your email for verification.");
    } catch (error) {
        console.error(error);
        return helpers.sendResponse(res, "error", 500, "Server error");
    }
});

loginRouter.get("/verify/:uniqueString", async (req, res) => {
    const { uniqueString } = req.params;

    try {
        // Find the verification record
        const verificationRecord = await UserVerification.findOne({ uniqueString });

        if (!verificationRecord) {
            return helpers.sendResponse(res, "error", 400, "Invalid or expired token");
        }

        // Check if the token has expired
        if (new Date() > verificationRecord.expiresAt) {
            await UserVerification.deleteOne({ _id: verificationRecord._id }); // Clean up expired record
            return helpers.sendResponse(res, "error", 400, "Token has expired. Please register again.");
        }

        // Update user's verified status
        await User.updateOne({ _id: verificationRecord.userId }, { verified: true });

        // Optionally delete the verification record after successful verification
        await UserVerification.deleteOne({ _id: verificationRecord._id });

        return helpers.sendResponse(res, "success", 200, "Email verified successfully! You can now log in.");
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

        // Check if the user exists and if they are verified
        if (!user) {
            return helpers.sendResponse(res, "error", 400, "Invalid credentials");
        }

        if (!user.verified) {
            return helpers.sendResponse(res, "error", 403, "Please verify your email before logging in.");
        }

        // Check if the password is correct
        if (await bcrypt.compare(password, user.password)) {
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