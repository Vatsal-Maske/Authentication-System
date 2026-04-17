import {Router} from "express";
import * as authController from "../controllers/auth.controller.js";
const authRouter = Router();

/**
 * @route POST /api/auth/register
 */

authRouter.post("/register",authController.register);

/**
 * @route POST /api/auth/login
 */
// authRouter.post("/login", authController.login);

/**
 * @route GET /api/auth/getMe
 */
authRouter.get("/getMe", authController.getMe);

export default authRouter;