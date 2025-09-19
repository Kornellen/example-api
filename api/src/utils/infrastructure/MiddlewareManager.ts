import express, { Express, RequestHandler } from "express";
import {
  redirectToApi,
  redirectToHTTPS,
} from "../../REST/middlewares/redirects";
import { morganLogger } from "../config/logger";
import passport from "passport";
import cors from "cors";
import helmet from "helmet";
export class MiddlewareManager {
  private static middlewareList: RequestHandler[] = [
    express.json(),
    express.urlencoded({ extended: true }),
    redirectToHTTPS,
    redirectToApi,
    morganLogger,
    passport.initialize(),
    cors(),
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    }),
  ];

  public static loadMiddlewares(app: Express) {
    this.middlewareList.forEach((middleware) => app.use(middleware));
  }
}
