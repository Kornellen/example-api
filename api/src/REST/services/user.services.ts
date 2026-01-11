import { HttpError } from "../helpers/HttpError";
import { IPostRepository, IUserRepository } from "@app/interfaces/repositories";
import { IUserService } from "@app/interfaces/services";
import { ChangesType, UserPrivate, UserPublic } from "./types/user.types";
import { Mapper } from "src/utils/others/DTOMapper";
import { UserPrivateDTO, UserPublicDTO } from "./types/dtos/UserDTO";

export class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private postRepository: IPostRepository
  ) {}

  // Returns users private data
  public async getPrivateData(userId: string): Promise<UserPrivateDTO> {
    const userPosts = (await this.postRepository.findUserPosts(userId)) ?? [];

    const userPrivateData = await this.userRepository.getUserData<UserPrivate>(
      userId,
      "PRIVATE"
    );
    if (!userPrivateData) throw new HttpError("User not found", 404);

    const userPrivateDTO: Mapper<UserPrivate, UserPrivateDTO> = (
      user
    ): UserPrivateDTO => ({
      id: user.id,
      username: user.username,
      email: user.email,
      city: null,
      posts: userPosts,
      role: user.role,
      age: user.age,
      first_name: user.first_name,
      last_name: user.last_name,
      loginMethodName: user.loginMethod.name,
      postsCount: user._count.comments,
      commentsCount: user._count.posts,
    });

    return userPrivateDTO(userPrivateData);
  }

  //Return users data
  public async getUserPublicData(userId: string): Promise<UserPublicDTO> {
    const userPosts = (await this.postRepository.findUserPosts(userId)) ?? [];

    const user = await this.userRepository.findUserById(userId);

    if (!user) throw new HttpError("User not found", 404);

    const userPublicData = await this.userRepository.getUserData<UserPublic>(
      userId,
      "PUBLIC"
    );

    if (!userPublicData) throw new HttpError("User not found", 404);

    const userPublicDTO: Mapper<UserPublic, UserPublicDTO> = (
      user
    ): UserPublicDTO => ({
      id: user.id,
      username: user.username,
      email: user.email,
      commentsCount: user._count.comments,
      posts: userPosts,
      role: user.role,
    });

    return userPublicDTO(userPublicData);
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
