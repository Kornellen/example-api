import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/HttpError";

/**
 * @function verifyJWT - Middleware verifing propriety of JsonWebToken sended in cookie
 * if token is valid and not expiried assign decoded value to @param req.user and allows user to access dashboard
 * @returns {void}
 */

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.headers.cookie?.split("=")[1] ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new HttpError("No token Provided", 403);
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        throw new HttpError("Invalid or expired token", 401);
      }

      const { userId, username, userRole, iat, exp } =
        decoded as Express.UserToken;

      req.user = {
        token,
        userId,
        username,
        userRole,
        iat,
        exp,
      } as Express.UserToken;
    });
    next();
  } catch (error) {
    next(error);
  }
};
