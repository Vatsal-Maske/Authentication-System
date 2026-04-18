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
authRouter.post("/login", authController.login);

/**
 * @route GET /api/auth/getMe
 */
authRouter.get("/getMe", authController.getMe);
/**
 * @route GET /api/auth/refresh-token
 */

authRouter.get("/refresh-token",authController.refreshToken)

/**
 * @route GET /api/auth/logout
 */
authRouter.get("/logout",authController.logout)

/**
 * @route GET /api/auth/logout-all
 */

authRouter.get("/logout-all",authController.logoutAll)

/**
 * @route GET /api/auth/verify-email
 */
authRouter.get("/verify-email",authController.verifyEmail)

export default authRouter;