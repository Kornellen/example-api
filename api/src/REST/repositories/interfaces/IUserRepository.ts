import { User } from "@app/db/models";

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

  getUserData(userId: string, additonalSettings: object): Promise<User | null>;

  modifyUserData(dataToModify: object, userId: string): Promise<ReturnMessage>;

  deleteUser(user: User, password: string): Promise<ReturnMessage>;
}
