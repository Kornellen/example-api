import { ClassicStrategyService } from "./strategies/ClassicStrategyService";

export class AuthService {
  constructor(private classicStrategyService: ClassicStrategyService) {}

  // Classic register via Login/Email, Password etc
  public async registry(
    username: string,
    email: string,
    password: string
  ): Promise<ReturnMessage> {
    return this.classicStrategyService.registry(username, email, password);
  }

  // Classic login via login/email, password
  public async login(
    login: string,
    password: string
  ): Promise<Express.UserToken> {
    return this.classicStrategyService.login(login, password);
  }
}
