import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

export const sendVerificationEmail = async (email, uniqueString) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${uniqueString}`;
    await transporter.sendMail({
        to: email,
        subject: "Email Verification",
        html: `<p>Please click <a href="${verificationUrl}">here</a> to verify your account.</p>`
    });
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
        to: email,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p><p>This link is valid for 1 hour.</p>`,
    });
};