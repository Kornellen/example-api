import { NextFunction, Request, Response } from "express";
import { WishlistServices } from "../services/wishlist.services";
import { HttpError } from "../helpers/HttpError";
import { isUserToken } from "../../utils/others/typeGuards";

export class WishlistController {
  private wishlistService: WishlistServices;

  constructor() {
    this.wishlistService = new WishlistServices();
  }

  public async getWishlistProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user || !isUserToken(req.user) || !req.user.userId) {
        throw new HttpError("Unauthorized", 403);
      }

      const { userId } = req.user;

      const response = await this.wishlistService.getWishlistProducts(userId);

      res.send(response);
    } catch (error) {
      next(error);
    }
  }

  public async addProductToWishlist(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { wishlistId, productId } = req.body;

      const response = await this.wishlistService.addProductToWishlist(
        wishlistId,
        productId
      );

      res.send(response);
    } catch (error) {
      next(error);
    }
  }

  public async removeProductFromWishlist(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { wishlistProductId } = req.body;

      const response = await this.wishlistService.removeProductFromWishlist(
        wishlistProductId
      );

      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}
