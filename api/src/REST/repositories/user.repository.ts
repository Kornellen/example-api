import { prisma } from "@app/db";
import { HttpError } from "../helpers/HttpError";
import { SecurityManager } from "@app/security";
import { IUserRepository } from "@app/interfaces/repositories";
import { User } from "@app/db/models";
export class UserRepository implements IUserRepository {
  constructor() {}
  public async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  public async findUserByEmailOrUsername(login: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        OR: [{ username: login }, { email: login }],
      },
    });
  }

  public async findUserById(userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  public async createUser(
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

  public async getUserData(
    userId: string,
    additonalSettings: object
  ): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      ...additonalSettings,
    });
  }

  public async modifyUserData(
    dataToModify: object,
    userId: string
  ): Promise<ReturnMessage> {
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

  public async deleteUser(
    user: User,
    password: string
  ): Promise<ReturnMessage> {
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
