import {Router} from "express";
import {
    forgotPasswordController,
    loginController,
    registerController,
    resendVerificationController,
    resetPasswordController,
    verifyController
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.get("/verify/:uniqueString", verifyController);
authRouter.post("/resend-verification", resendVerificationController);
authRouter.post("/login", loginController);
authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);

export default authRouter;