import { WishlistProduct } from "@prisma/client";

export interface IWishlistService {
  getWishlistProducts(userId: string): Promise<WishlistProduct[] | null>;

  addProductToWishlist(
    wishlistId: number,
    productId: string
  ): Promise<ReturnMessage>;

  removeProductFromWishlist(wishlistProductId: number): Promise<ReturnMessage>;
}
