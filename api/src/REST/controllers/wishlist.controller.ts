import { NextFunction, Request, Response } from "express";
import { HttpError } from "../helpers/HttpError";
import { isUserToken } from "../../utils/others/typeGuards";
import { container } from "src/utils/infrastructure/DIContainer";
import { IWishlistService } from "@app/interfaces/services";

export class WishlistController {
  private wishlistService: IWishlistService;

  constructor() {
    this.wishlistService = container.get<IWishlistService>("WishlistService");
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
