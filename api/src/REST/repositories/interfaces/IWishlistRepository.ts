import { WishlistProduct } from "@app/db/models";

export interface IWishlistRepository {
  getWishlistProducts(userId: string): Promise<WishlistProduct[] | null>;

  addProductToWishlist(
    productId: string,
    wishlistId: number
  ): Promise<ReturnMessage>;

  removeProductFromWishlist(wishlistProductId: number): Promise<ReturnMessage>;
}
