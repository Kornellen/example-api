import { Profile, VerifyCallback } from "passport-google-oauth20";
import { HttpError } from "../../../helpers/HttpError";
import { SecurityManager } from "../../../../utils/security/SecurityManager";
import { User } from "@prisma/client";
import { UserRepository } from "../../../repositories/user.repository";
export class GoogleStrategyService {
  async login(profile: Profile, done: VerifyCallback): Promise<void> {
    try {
      if (!profile.emails || !profile.emails[0]?.value) {
        throw new HttpError("Email is required", 400);
      }

      let user: User | null;

      user = await UserRepository.findUserByEmail(profile.emails[0].value);

      if (!user) {
        user = await UserRepository.createUser(
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
