import { HttpError } from "../helpers/HttpError";
import { IUserRepository } from "@app/interfaces/repositories";
import { IUserService } from "@app/interfaces/services";
import { ChangesType } from "./types/user.types";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}
  // Returns users private data
  public async getPrivateData(userId: string): Promise<any> {
    const settings = {
      include: {
        posts: {
          select: {
            content: true,
            title: true,
            _count: { select: { likes: true } },
          },
        },
      },
    };
    const user = await this.userRepository.getUserData(userId, settings);

    if (!user) throw new HttpError("User not found", 404);

    return user;
  }

  //Return users data
  public async getUserData(userId: string) {
    const settings = {
      select: {
        id: true,
        username: true,
        posts: {
          where: {
            published: true,
          },
          select: {
            content: true,
            title: true,
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
            published: true,
          },
        },
        city: true,
        role: true,
        email: true,
        _count: {
          select: {
            comments: {
              where: {
                authorId: userId,
              },
            },
          },
        },
      },
    };

    const user = await this.userRepository.findUserById(userId);

    if (!user) throw new HttpError("User not found", 404);

    return await this.userRepository.getUserData(userId, settings);
  }

  // Manipulating user data
  public async modifyData(userId: string, changes: ChangesType) {
    const user = await this.userRepository.findUserById(userId);

    if (!user) throw new HttpError("User Not Found!", 404);

    return await this.userRepository.modifyUserData(changes, userId);
  }

  // Deleting user account
  public async deleteAccount(userId: string, password: string) {
    const user = await this.userRepository.findUserById(userId);

    if (!user) throw new HttpError("User Not Found", 404);

    return await this.userRepository.deleteUser(user, password);
  }
}
