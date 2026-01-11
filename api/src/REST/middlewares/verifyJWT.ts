import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * @function verifyJWT - Middleware verifing propriety of JsonWebToken sended in cookie
 * if token is valid and not expiried assign decoded value to @param req.user and allows user to access dashboard
 * @returns {void}
 */

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.user = undefined;

    const token =
      req.headers.cookie?.split("=")[1] ||
      req.headers.authorization?.split(" ")[1];

    if (!token) return next();
    try {
      jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if (err) {
          return next();
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
    } catch (error) {
      req.user = undefined;
    }

    next();
  } catch (error) {
    next(error);
  }
};
