import {Router} from "express";
import {
    forgotPasswordController,
    loginController,
    registerController,
    resetPasswordController,
    verifyController
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/verify", verifyController);
authRouter.post("/login", loginController);
authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController)

export default authRouter;