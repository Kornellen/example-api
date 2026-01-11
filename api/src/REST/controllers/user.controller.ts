import { NextFunction, Request, Response } from "express";
import { container } from "src/utils/infrastructure/DIContainer";
import { IUserService } from "@app/interfaces/services";
import { isUserToken } from "src/utils/others/typeGuards";
import { HttpError } from "../helpers/HttpError";

export class UserController {
  private userService: IUserService;

  constructor() {
    this.userService = container.get<IUserService>("UserService");
  }
  public async getUserPrivateData(req: any, res: Response, next: NextFunction) {
    try {
      const { username, userId } = req.user;
      const response = await this.userService.getPrivateData(userId);
      res.send({ logged: `Logged As ${username}`, response });
    } catch (error) {
      next(error);
    }
  }

  public async getUserData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.query;

      let response = await this.userService.getUserPublicData(String(id));

      res.send(response);
    } catch (error) {
      next(error);
    }
  }

  public async modifyData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user || !isUserToken(req.user) || !req.user.userId)
        throw new HttpError("Invalid Credentials", 401);
      const { changes } = req.body;
      const { id } = req.params;
      const { userId } = req.user;
      let response;
      if (id === userId)
        response = await this.userService.modifyData(String(userId), changes);
      else {
        response = null;
        throw new HttpError("Invalid Credentials", 401);
      }
      res.send(response);
    } catch (error) {
      next(error);
    }
  }

  public async deleteAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { password } = req.body;

      const response = await this.userService.deleteAccount(
        String(id),
        password
      );
      console.log(response);
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}
