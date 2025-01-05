import {
    forgotPassword,
    loginUser,
    registerUser,
    resendVerification,
    resetPassword,
    verifyUser
} from '../services/auth.service.js';
import {reSendVerificationEmail, sendPasswordResetEmail, sendVerificationEmail} from '../services/email.service.js';
import agenda from "../utils/agenda.js";

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
       const user = await verifyUser(uniqueString);
        await agenda.schedule('in a few seconds', 'send welcome email', { email: user.email });
        // Schedule the congratulatory email to be sent one month later
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1); // Add one month to the current date
        await agenda.schedule(oneMonthLater, 'send congratulatory email', { email: user.email });
        return helpers.sendResponse(res, "success", 200, "Email verified successfully! You can now log in.");
    } catch (error) {
        console.error(error);
        if (error.status && error.message) {
            return helpers.sendResponse(res, "error", error.status, error.message);
        } else {
            return helpers.sendResponse(res, "error", 500, "Server error");
        }    }
};

export const resendVerificationController = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await resendVerification(email);
        await reSendVerificationEmail(user.email, user.verification.uniqueString);
        return helpers.sendResponse(res, "success", 200, "New verification link has been sent to your email.");
    } catch (error) {
        console.error(error);
        if (error.status && error.message) {
            return helpers.sendResponse(res, "error", error.status, error.message);
        } else {
            return helpers.sendResponse(res, "error", 500, "Server error");
        }
    }
}

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
