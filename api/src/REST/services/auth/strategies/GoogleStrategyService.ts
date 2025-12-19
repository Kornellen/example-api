import { Profile, VerifyCallback } from "passport-google-oauth20";
import { HttpError } from "../../../helpers/HttpError";
import { SecurityManager } from "@app/security";
import { User } from "@app/db/models";
import { IUserRepository } from "@app/interfaces/repositories";
export class GoogleStrategyService {
  constructor(private userRepository: IUserRepository) {}
  async login(profile: Profile, done: VerifyCallback): Promise<void> {
    try {
      if (!profile.emails || !profile.emails[0]?.value) {
        throw new HttpError("Email is required", 400);
      }

      let user: User | null;

      user = await this.userRepository.findUserByEmail(profile.emails[0].value);

      if (!user) {
        user = await this.userRepository.createUser(
          profile.emails[0].value,
          profile.displayName,
          "Social"
        );
      }

      const token = SecurityManager.generateUserToken(
        user.id,
        profile.displayName,
        user.role
      );

      done(null, { user, token });
    } catch (error: any) {
      throw new HttpError(error, 500);
    }
  }
}
