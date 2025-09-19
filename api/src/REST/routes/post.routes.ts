import { NextFunction, Request, Response, Router } from "express";
import { PostController } from "../controllers/post.controller";
import { verifyJWT } from "../middlewares/verifyJWT";
import { validateRequst } from "../middlewares/validator";
import { body, header, param } from "express-validator";

const postRouter = Router();
const postController = new PostController();

postRouter.post(
  "/post",
  [
    body("title")
      .notEmpty()
      .isLength({ max: 40 })
      .withMessage("Title is empty or longer than 40 chars"),
    body("content")
      .notEmpty()
      .isLength({ max: 191 })
      .withMessage("Content is empty or longer than 191 chars"),
    body("published").notEmpty().isBoolean(),
    body("userId").notEmpty().isUUID("all").withMessage("Invalid UUID"),
  ],
  validateRequst,
  verifyJWT,
  (req: Request, res: Response, next: NextFunction) =>
    postController.createPost(req, res, next)
);

postRouter.get(
  "/post/:id",
  [param("id").notEmpty()],
  validateRequst,
  (req: Request, res: Response, next: NextFunction) =>
    postController.getPostData(req, res, next)
);

postRouter.patch(
  "/post/:id",
  verifyJWT,
  [param("id").notEmpty()],
  validateRequst,
  (req: Request, res: Response, next: NextFunction) =>
    postController.changePostVisability(req, res, next)
);

postRouter.put(
  "/post/:id",
  verifyJWT,
  [
    param("id").notEmpty(),
    body("title").optional().isLength({ max: 40 }),
    body("content").optional().isLength({ max: 191 }),
    header("Authorization")
      .exists()
      .withMessage("Authorization header is required")
      .matches(/^Bearer\s.+$/)
      .withMessage(
        "Authorization header must to be in format 'Bearer <token>'"
      ),
  ],
  validateRequst,
  (req: Request, res: Response, next: NextFunction) =>
    postController.updatePost(req, res, next)
);

postRouter.delete(
  "/post/:id",
  [
    param("id").notEmpty(),
    header("Authorization")
      .exists()
      .withMessage("Authorization header is required")
      .matches(/^Bearer\s.+$/)
      .withMessage(
        "Authorization header must to be in format 'Bearer <token>'"
      ),
  ],
  validateRequst,
  verifyJWT,
  (req: Request, res: Response, next: NextFunction) =>
    postController.removePost(req, res, next)
);

postRouter.get(
  "/post/:id/like",
  [
    param("id").notEmpty(),
    header("Authorization")
      .exists()
      .withMessage("Authorization header is required")
      .matches(/^Bearer\s.+$/)
      .withMessage(
        "Authorization header must to be in format 'Bearer <token>'"
      ),
  ],
  validateRequst,
  verifyJWT,
  (req: Request, res: Response, next: NextFunction) => {
    postController.likePost(req, res, next);
  }
);

postRouter.get("/posts", (req: Request, res: Response, next: NextFunction) => {
  postController.getPosts(req, res, next);
});

export default postRouter;
