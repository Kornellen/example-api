import { NextFunction, Response, Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { verifyJWT } from "../middlewares/verifyJWT";

const commentRouter = Router();
const commentController: CommentController = new CommentController();

commentRouter.post(
  "/comment",
  verifyJWT,
  (req: any, res: Response, next: NextFunction) =>
    commentController.createComment(req, res, next)
);

commentRouter.delete(
  "/comment",
  verifyJWT,
  (req: any, res: Response, next: NextFunction) =>
    commentController.removeComment(req, res, next)
);

commentRouter.patch(
  "/comment",
  verifyJWT,
  (req: any, res: Response, next: NextFunction) =>
    commentController.updateComment(req, res, next)
);

commentRouter.patch(
  "/comment/like",
  verifyJWT,
  (req: any, res: Response, next: NextFunction) =>
    commentController.likeComment(req, res, next)
);
export default commentRouter;
