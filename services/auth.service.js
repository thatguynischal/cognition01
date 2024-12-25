import User from '../models/user.js';
import UserVerification from "../models/userVerification.js";
import PasswordReset from "../models/passwordReset.js"; // Import the PasswordReset model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';

export const registerUser = async (name, email, password) => {
    if (!name || !email || !password) {
        throw { status: 400, message: "Please add all fields" };
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw { status: 400, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, verified: false });

    const uniqueString = uuidv4();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt);
    expiresAt.setHours(expiresAt.getHours() + 24);

    const verification = await UserVerification.create({
        userId: user._id,
        uniqueString,
        createdAt,
        expiresAt,
    });

    return { ...user.toJSON(), verification };
};

export const verifyUser = async (uniqueString) => {
    const verificationRecord = await UserVerification.findOne({uniqueString});

    if (!verificationRecord) {
        throw {status: 400, message: "Invalid or expired token."};
    }

    if (new Date() > verificationRecord.expiresAt) {
        await UserVerification.deleteOne({_id: verificationRecord._id});
        throw {status: 400, message: "Token has expired. Please register again."};
    }

    await User.updateOne({_id: verificationRecord.userId}, {verified: true});
    await UserVerification.deleteOne({_id: verificationRecord._id});

    return true;
};

export const resendVerification = async (verificationEmail) => {

    const user = await User.findOne({email: verificationEmail});
    if (!user) {
        throw {status: 400, message: "No user found. Please check your email again."};
    }

    const verificationRecord = await UserVerification.findOne({userId: user._id});

    if (verificationRecord) {
        await UserVerification.deleteOne({_id: verificationRecord._id});
    }

    const uniqueString = uuidv4();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt);
    expiresAt.setHours(expiresAt.getHours() + 24);

    const verification = await UserVerification.create({
        userId: user._id, uniqueString, createdAt, expiresAt,
    });


    return {...user.toJSON(), verification};

}

export const loginUser = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        throw {status: 400, message: "Invalid credentials."};
    }

    if (!user.verified) {
        throw {status: 403, message: "Please verify your email before logging in."};
    }

    if (!(await bcrypt.compare(password, user.password))) {
        throw {status: 400, message: "Invalid credentials."};
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "30d"});
    return {_id: user.id, name: user.name, email: user.email, token};
};

export const forgotPassword = async (email) => {
    const user = await User.findOne({email});

    if (!user) {
        throw {status: 400, message: "User with this email does not exist."};
    }

    const resetToken = uuidv4();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt);
    expiresAt.setHours(expiresAt.getHours() + 1);

    await PasswordReset.create({userId: user._id, resetToken, createdAt, expiresAt});

    return resetToken;
};

export const resetPassword = async (token, password, confirmPassword) => {

    if (password !== confirmPassword) {
        throw {status: 400, message: "Passwords do not match."};
    }

    const tokenStatus = await PasswordReset.findOne({resetToken: token});

    if (!tokenStatus) {
        throw {status: 400, message: "Invalid or expired token."};
    }

    if (new Date() > tokenStatus.expiresAt) {
        await PasswordReset.deleteOne({_id: tokenStatus._id});
        throw {status: 400, message: "Token has expired. Please request a new password reset."};
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(tokenStatus.userId, {password: hashedPassword}, {new: true});

    await PasswordReset.deleteOne({_id: tokenStatus._id});

    return true;
};
