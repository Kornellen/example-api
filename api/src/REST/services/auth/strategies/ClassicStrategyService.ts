import { User } from "@prisma/client";
import { prisma } from "../../../../utils/infrastructure/prisma";
import { HttpError } from "../../../helpers/HttpError";
import { SecurityManager } from "../../../../utils/security/SecurityManager";
import { UserRepository } from "../../../repositories/user.repository";
export class ClassicStrategyService {
  public async registry(
    username: string,
    email: string,
    password: string
  ): Promise<ReturnMessage> {
    try {
      const existingUser: User | null = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        new HttpError("User with this email or username exists", 409);
        return { message: "User with this email or username exists" };
      }

      const hashedPassword: string = await SecurityManager.hashPassword(
        password
      );

      await UserRepository.createUser(
        email,
        username,
        "Classic",
        hashedPassword
      );

      return { message: "User registered successfully" };
    } catch (error: any) {
      throw new HttpError(error, 500);
    }
  }

  public async login(
    login: string,
    password: string
  ): Promise<Express.UserToken> {
    try {
      const existingUser: User | null =
        await UserRepository.findUserByEmailOrUsername(login);

      if (
        !existingUser ||
        !(await SecurityManager.comparePasswords(
          password,
          existingUser.password
        ))
      ) {
        throw new HttpError("Invalid credentials", 401);
      }

      const token = SecurityManager.generateUserToken(
        existingUser.id,
        existingUser.username,
        existingUser.role
      );

      return { token };
    } catch (error: any) {
      throw new HttpError(error, 401);
    }
  }
}
