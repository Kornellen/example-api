import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.services";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
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

      let response = await this.userService.getUserData(String(id));

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
      const { id } = req.params;
      const { changes } = req.body;

      const response = await this.userService.modifyData(id, changes);

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

      const response = await this.userService.deleteAccount(id, password);
      console.log(response);
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}
