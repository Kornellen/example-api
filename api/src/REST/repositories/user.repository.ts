import { User } from "@prisma/client";
import { prisma } from "../../utils/infrastructure/prisma";
import { HttpError } from "../helpers/HttpError";
import { SecurityManager } from "../../utils/security/SecurityManager";

export class UserRepository {
  public static async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  public static async findUserByEmailOrUsername(
    login: string
  ): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        OR: [{ username: login }, { email: login }],
      },
    });
  }

  public static async findUserById(userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  public static async createUser(
    email: string,
    username: string,
    type: "Classic" | "Social",
    hashedPassword?: string
  ): Promise<User> {
    return await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: type === "Classic" ? hashedPassword ?? "" : "",
        loginMethod: {
          connect: { id: type === "Classic" ? 2 : 1 },
        },
        cart: {
          create: {},
        },
        wishlist: {
          create: {},
        },
      },
    });
  }

  public static async getUserData(userId: string, additonalSettings: object) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      ...additonalSettings,
    });
  }

  public static async modifyUserData(
    dataToModify: object,
    userId: string
  ): Promise<IReturnMessage> {
    let changesObj: any = {};

    if (Object.keys(dataToModify).length === 0)
      return { message: "Nothing changed" };

    for (const [change, value] of Object.entries(dataToModify)) {
      if (change === "role") continue;
      value !== null ? (changesObj[change] = value) : null;
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: changesObj,
    });

    return {
      message: `Successfully changed ${
        Object.keys(changesObj).length === 1
          ? "1 element"
          : `${Object.keys(changesObj).length} elements`
      }`,
    };
  }

  public static async deleteUser(
    user: User,
    password: string
  ): Promise<IReturnMessage> {
    if (
      user.loginMethodId === 2 &&
      (!password ||
        !user.password ||
        !SecurityManager.comparePasswords(password, user.password))
    ) {
      throw new HttpError("Invalid Credentials", 401);
    }

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return { message: "Successfully removed account" };
  }
}
