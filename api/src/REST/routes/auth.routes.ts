import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import passport from "passport";
import { rateLimiter } from "../middlewares/rateLimiter";
import { validateRequst } from "../middlewares/validator";
import { body } from "express-validator";

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  "/login",
  [
    body("login").notEmpty().isLength({ min: 3 }).withMessage("Invalid Login"),
    body("password").notEmpty().withMessage("Password is empty"),
  ],
  validateRequst,
  rateLimiter,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next)
);

authRouter.post(
  "/register",
  [
    body("username")
      .notEmpty()
      .isLength({ min: 5, max: 16 })
      // .matches(/^(?!\s)[A-Za-z0-9_.<>$!@\s ]{5,16}(?<!\s)$/)
      .withMessage(
        "Username can only contain letters, numbers, spaces, and special characters (_ . <> $ ! @), and must be between 5 and 16 characters long"
      ),
    body("email").isEmail().notEmpty().withMessage("Email is not correct"),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minNumbers: 2,
        minUppercase: 1,
        minSymbols: 2,
      })
      .notEmpty()
      .withMessage(
        "Password should contain at least 8 characters, 2 numbers, 1 uppercase letter, 2 special characters"
      ),
  ],
  validateRequst,
  rateLimiter,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next)
);

authRouter.get(
  "/auth/google/",
  rateLimiter,
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req: any, res: Response, next) => {
    authController.googleLogin(req, res, next);
  }
);

export default authRouter;
