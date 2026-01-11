import { Request, NextFunction, Response } from "express";
import { HttpError } from "../helpers/HttpError";
import { isUserToken } from "../../utils/others/typeGuards";
import { container } from "../../utils/infrastructure/DIContainer";
import { IPostService } from "../services/interfaces";

export class PostController {
  private postServices: IPostService;

  constructor() {
    this.postServices = container.get<IPostService>("PostService");
  }

  public async createPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, content, published } = req.body;

      if (!req.user || !isUserToken(req.user) || !req.user.userId) {
        throw new HttpError("Unauthorized", 403);
      }

      const { userId } = req.user;

      const response = await this.postServices.createPost(
        userId,
        title,
        published,
        content
      );

      res.json(response);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  public async getPostData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      let userId;

      if (!req.user || !isUserToken(req.user) || !req.user.userId) userId = "";
      else userId = req.user.userId;

      if (isNaN(Number(id)) || !id) throw new HttpError("Bad Request", 400);

      const response = await this.postServices.getPostData(Number(id), userId);

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  public async changePostVisability(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        throw new HttpError("Bad Request", 400);
      }

      const response = await this.postServices.changePostVisability(Number(id));

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  public async updatePost(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const changes = req.body;

      if (!id || isNaN(Number(id))) {
        throw new HttpError("Bad Reques", 400);
      }

      const response = await this.postServices.updatePost(
        Number(id),
        userId,
        changes
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  public async removePost(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { userId } = req.user;

      if (!id || isNaN(Number(id))) {
        throw new HttpError("Bad Reques", 400);
      }

      const response = await this.postServices.removePost(Number(id), userId);

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  public async likePost(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (req.user === undefined) throw new HttpError("Unauthorized", 401);
      const { userId } = req.user;

      if (!id || isNaN(Number(id))) {
        throw new HttpError("Bad Reques", 400);
      }

      const response = await this.postServices.likePost(userId, Number(id));

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  public async getPosts(req: any, res: Response, next: NextFunction) {
    try {
      const response = await this.postServices.getPublicPost();

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
