import { WishlistProduct } from "@prisma/client";
import { WishlistRepository } from "../repositories/wishlist.repository";

export class WishlistServices {
  public async getWishlistProducts(
    userId: string
  ): Promise<WishlistProduct[] | null> {
    return await WishlistRepository.getWishlistProducts(userId);
  }

  public async addProductToWishlist(
    wishlistId: number,
    productId: string
  ): Promise<ReturnMessage> {
    return WishlistRepository.addProductToWishlist(productId, wishlistId);
  }

  public async removeProductFromWishlist(
    wishlistProductId: number
  ): Promise<ReturnMessage> {
    return WishlistRepository.removeProductFromWishlist(wishlistProductId);
  }
}
