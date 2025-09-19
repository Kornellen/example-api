import { WishlistProduct } from "@prisma/client";
import { prisma } from "../../utils/infrastructure/prisma";

export class WishlistRepository {
  public static async getWishlistProducts(
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

  public static async addProductToWishlist(
    productId: string,
    wishlistId: number
  ): Promise<IReturnMessage> {
    await prisma.wishlistProduct.create({
      data: {
        productId: productId,
        wishlistId: wishlistId,
      },
    });

    return { message: "Product Added to wishlist" };
  }

  public static async removeProductFromWishlist(
    wishlistProductId: number
  ): Promise<IReturnMessage> {
    await prisma.wishlistProduct.delete({
      where: {
        id: wishlistProductId,
      },
    });

    return { message: "Successfull removed from wishlist" };
  }
}
