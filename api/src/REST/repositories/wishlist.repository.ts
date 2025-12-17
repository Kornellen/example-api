import { IWishlistRepository } from "@app/interfaces/repositories";
import { prisma } from "@app/db";
import { WishlistProduct } from "@app/db/models";
export class WishlistRepository implements IWishlistRepository {
  constructor() {}
  public async getWishlistProducts(
    userId: string
  ): Promise<WishlistProduct[] | null> {
    return await prisma.wishlistProduct.findMany({
      where: {
        wishlist: {
          userId: userId,
        },
      },
    });
  }

  public async addProductToWishlist(
    productId: string,
    wishlistId: number
  ): Promise<ReturnMessage> {
    await prisma.wishlistProduct.create({
      data: {
        productId: productId,
        wishlistId: wishlistId,
      },
    });

    return { message: "Product Added to wishlist" };
  }

  public async removeProductFromWishlist(
    wishlistProductId: number
  ): Promise<ReturnMessage> {
    await prisma.wishlistProduct.delete({
      where: {
        id: wishlistProductId,
      },
    });

    return { message: "Successfull removed from wishlist" };
  }
}
