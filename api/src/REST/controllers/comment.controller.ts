import { NextFunction, Response } from "express";
import { CommentService } from "../services/comment.services";

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  public async createComment(req: any, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { content, postId } = req.body;
      const response = await this.commentService.addComment(
        userId,
        content,
        postId
      );

      res.send(response);
    } catch (error) {
      next(error);
    }
  }

  public async removeComment(req: any, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.body;
      const { userId } = req.user;

      const response = await this.commentService.removeComment(
        commentId,
        userId
      );

      res.send(response);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  public async updateComment(req: any, res: Response, next: NextFunction) {
    try {
      const { commentId, changes } = req.body;

      const response = await this.commentService.updateComment(
        commentId,
        changes
      );

      res.send(response);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  public async likeComment(req: any, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.body;
      const { userId } = req.user;

      const response = await this.commentService.likeComment(commentId, userId);

      res.send(response);
    } catch (error) {
      console.error(error);
    }
  }
}
