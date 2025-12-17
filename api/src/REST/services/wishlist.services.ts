import { WishlistProduct } from "@app/db/models";
import { IWishlistRepository } from "@app/interfaces/repositories";

export class WishlistService {
  constructor(private wishlistRepository: IWishlistRepository) {}
  public async getWishlistProducts(
    userId: string
  ): Promise<WishlistProduct[] | null> {
    return await this.wishlistRepository.getWishlistProducts(userId);
  }

  public async addProductToWishlist(
    wishlistId: number,
    productId: string
  ): Promise<ReturnMessage> {
    return this.wishlistRepository.addProductToWishlist(productId, wishlistId);
  }

  public async removeProductFromWishlist(
    wishlistProductId: number
  ): Promise<ReturnMessage> {
    return this.wishlistRepository.removeProductFromWishlist(wishlistProductId);
  }
}
