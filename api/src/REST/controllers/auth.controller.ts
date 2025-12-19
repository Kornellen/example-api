import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth/auth.services";
import { isUserToken } from "../../utils/others/typeGuards";
import { ClassicStrategyService } from "../services/auth/strategies/ClassicStrategyService";
import { SecurityManager } from "../../utils/security/SecurityManager";
import { container } from "src/utils/infrastructure/DIContainer";
export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    const classicStrategyService = container.get<ClassicStrategyService>(
      "ClassicStrategyService"
    );
    this.authService = new AuthService(classicStrategyService);
  }

  public googleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void {
    try {
      if (!req.user || !isUserToken(req.user)) {
        return res.redirect("/");
      }

      const { token } = req.user;

      if (!token) {
        return res.redirect("/");
      }

      if (req.headers.accept?.includes("application/json"))
        return res.json(token);

      SecurityManager.returnAuthToken(res, token);

      return res.redirect("/dashboard");
    } catch (error) {
      next(error);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { login, password } = req.body;

      const { token } = await this.authService.login(login, password);

      if (req.headers["content-type"] === "application/json") {
        res.json({ token });
        return;
      }

      SecurityManager.returnAuthToken(res, token);

      res.redirect("/dashboard");
    } catch (error) {
      next(error);
    }
  }

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password } = req.body;

      const response = await this.authService.registry(
        username,
        email,
        password
      );

      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}
