import { User } from "@app/db/models";
import { UserPrivate, UserPublic } from "src/REST/services/types/user.types";

export interface IUserRepository {
  findUserByEmail(email: string): Promise<User | null>;

  findUserByEmailOrUsername(login: string): Promise<User | null>;

  findUserById(userId: string): Promise<User | null>;

  createUser(
    email: string,
    username: string,
    type: "Classic" | "Social",
    hashedPassword?: string
  ): Promise<User>;

  getUserData<T extends User>(
    userId: string,
    config: "PUBLIC" | "PRIVATE"
  ): Promise<T | null>;

  modifyUserData(dataToModify: object, userId: string): Promise<ReturnMessage>;

  deleteUser(user: User, password: string): Promise<ReturnMessage>;
}
