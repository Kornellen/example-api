import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { EnvironmentManager } from "../../../../utils/env/EnvironmentManager";
import { GoogleStrategyService } from "../strategies/GoogleStrategyService";
export class PassportManager {
  public static configureGoogleStrategy(service: GoogleStrategyService): void {
    passport.use(
      new GoogleStrategy(
        {
          clientID:
            EnvironmentManager.loadEnvironmentVarible("GOOGLE_AUTH_ID")!,
          clientSecret:
            EnvironmentManager.loadEnvironmentVarible("GOOGLE_AUTH_SECRET")!,
          callbackURL:
            EnvironmentManager.loadEnvironmentVarible("CALLBACK_URL")!,
        },
        async (accessToken, refreshToken, profile, done) => {
          service.login(profile, done);
        }
      )
    );
  }
}
