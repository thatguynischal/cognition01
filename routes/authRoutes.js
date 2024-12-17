import {Router} from "express";
import {loginController, registerController, verifyController, forgotPasswordController} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/verify", verifyController);
authRouter.post("/login", loginController);
authRouter.post("/forgot-password", forgotPasswordController);

export default authRouter;