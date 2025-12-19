import "express";

declare global {
  namespace Express {
    export interface UserToken {
      token: string;
      userId?: string;
      username?: string;
      userRole?: string;
      iat?: number;
      exp?: number;
    }
    interface Request {
      user?: UserToken;
    }
  }
}

export {};
