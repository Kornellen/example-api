import { NextFunction, Request, Response, Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { verifyJWT } from "../middlewares/verifyJWT";

const wishlistRouter = Router();
const wishlistController = new WishlistController();

wishlistRouter.get(
  "/wishlist",
  verifyJWT,
  (req: any, res: any, next: NextFunction) =>
    wishlistController.getWishlistProducts(req, res, next),
);

wishlistRouter.post("/wishlist", (req: any, res: any, next: NextFunction) => {
  wishlistController.addProductToWishlist(req, res, next);
});

wishlistRouter.delete("/wishlist", (req: any, res: any, next: NextFunction) => {
  wishlistController.removeProductFromWishlist(req, res, next);
});

export default wishlistRouter;
