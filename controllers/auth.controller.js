import {forgotPassword, loginUser, registerUser, resetPassword, verifyUser} from '../services/auth.service.js';
import {sendPasswordResetEmail, sendVerificationEmail} from '../services/email.service.js';
import helpers from '../utils/helpers.js';

export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await registerUser(name, email, password, req, res);
        await sendVerificationEmail(user.email, user.verification.uniqueString);
        return helpers.sendResponse(res, "success", 201, "User created successfully. Please check your email for verification.");
    } catch (error) {
        console.error(error);
        if (error.status && error.message) {
            return helpers.sendResponse(res, "error", error.status, error.message);
        } else {
            return helpers.sendResponse(res, "error", 500, "Server error");
        }
    }
};


export const verifyController = async (req, res) => {
    try {
        const {uniqueString} = req.params;
        await verifyUser(uniqueString);
        return helpers.sendResponse(res, "success", 200, "Email verified successfully! You can now log in.");
    } catch (error) {
        console.error(error);
        if (error.status && error.message) {
            return helpers.sendResponse(res, "error", error.status, error.message);
        } else {
            return helpers.sendResponse(res, "error", 500, "Server error");
        }    }
};

export const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        const userData = await loginUser(email, password);
        return helpers.sendResponse(res, "success", 200, "Login successful", userData);
    } catch (error) {
        console.error(error);
        if (error.status && error.message) {
            return helpers.sendResponse(res, "error", error.status, error.message);
        } else {
            return helpers.sendResponse(res, "error", 500, "Server error");
        }    }
};

export const forgotPasswordController = async (req, res) => {
    try {
        const {email} = req.body;
        const resetToken = await forgotPassword(email);
        await sendPasswordResetEmail(email, resetToken);
        return helpers.sendResponse(res, "success", 200, "Password reset email sent.");
    } catch (error) {
        console.error(error);
        if (error.status && error.message) {
            return helpers.sendResponse(res, "error", error.status, error.message);
        } else {
            return helpers.sendResponse(res, "error", 500, "Server error");
        }
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const {token, password, confirmPassword} = req.body;
        await resetPassword(token, password, confirmPassword)
        return helpers.sendResponse(res, "success", 200, "Password reset successfull.");

    } catch (error) {
        console.error(error);
        if (error.status && error.message) {
            return helpers.sendResponse(res, "error", error.status, error.message);
        } else {
            return helpers.sendResponse(res, "error", 500, "Server error");
        }
    }
}

export default {
    registerController, verifyController, loginController, forgotPasswordController, resetPasswordController
};
