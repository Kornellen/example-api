import { HttpError } from "../helpers/HttpError";
import { UserRepository } from "../repositories/user.repository";

type ChangesType = {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  city: string | null;
  age: string | null;
};

export class UserService {
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
    const user = await UserRepository.getUserData(userId, settings);

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

    const user = await UserRepository.findUserById(userId);

    if (!user) throw new HttpError("User not found", 404);

    return await UserRepository.getUserData(userId, settings);
  }

  // Manipulating user data
  public async modifyData(userId: string, changes: ChangesType) {
    const user = await UserRepository.findUserById(userId);

    if (!user) throw new HttpError("User Not Found!", 404);

    return await UserRepository.modifyUserData(changes, userId);
  }

  // Deleting user account
  public async deleteAccount(userId: string, password: string) {
    const user = await UserRepository.findUserById(userId);

    if (!user) throw new HttpError("User Not Found", 404);

    return await UserRepository.deleteUser(user, password);
  }
}
