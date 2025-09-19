import * as jwt from "jsonwebtoken";
import { EnvironmentManager } from "../env/EnvironmentManager";
import bcrypt from "bcrypt";
import { Response } from "express";
import { Role } from "@prisma/client";

export class SecurityManager {
  private static readonly jwtSecret: string | undefined =
    EnvironmentManager.loadEnvironmentVarible("JWT_SECRET");

  public static jwtSign(
    userId: string,
    username: string,
    userRole: string
  ): string {
    if (!this.jwtSecret) throw new Error("JWT_SECRET Not found");

    return jwt.sign(
      { userId: userId, username: username, userRole: userRole },
      this.jwtSecret,
      {
        expiresIn: 20 * 60, //expires in 20 minutes
        algorithm: "HS256",
      }
    );
  }

  public static async hashPassword(password: string): Promise<string> {
    const hashSalt: string = bcrypt.genSaltSync(10);
    return await bcrypt.hash(password, hashSalt);
  }

  public static async comparePasswords(
    inputedPassword: string,
    dbPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(inputedPassword, dbPassword);
  }

  public static returnAuthToken(res: Response, token: string): void {
    res.cookie("token", token, {
      path: "/",
      secure: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "none",
      httpOnly: false,
    });

    res.setHeader("Authorization", `Bearer ${token}`);
  }

  public static generateUserToken(
    userId: string,
    username: string,
    role: Role
  ): string {
    return this.jwtSign(userId, username, role);
  }
}
