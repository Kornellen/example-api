import { NextFunction, Response, Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT";
import { UserController } from "../controllers/user.controller";

const userController = new UserController();
const userRouter = Router();

userRouter.get(
  "/dashboard",
  verifyJWT,
  (req: any, res: Response, next: NextFunction) =>
    userController.getUserPrivateData(req, res, next)
);

userRouter.get("/user", (req: any, res: Response, next: NextFunction) =>
  userController.getUserData(req, res, next)
);

userRouter.patch(
  "/user/:id/change",
  verifyJWT,
  (req: any, res: Response, next: NextFunction) =>
    userController.modifyData(req, res, next)
);

userRouter.delete(
  "/user/:id/delete",
  verifyJWT,
  (req: any, res: Response, next: NextFunction) =>
    userController.deleteAccount(req, res, next)
);

export default userRouter;
