import { NextFunction, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { HttpError } from "../helpers/HttpError";

export const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(new HttpError("Too many requests", 429));
  },
});
