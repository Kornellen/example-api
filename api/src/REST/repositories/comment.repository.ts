import { Comment, CommentLike } from "@prisma/client";
import { prisma } from "../../utils/infrastructure/prisma";

type CommentChanges = { content: string };

export class CommentRepository {
  public static async findCommentById(
    commentId: number
  ): Promise<Comment | null> {
    return await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
  }

  public static async createComment(
    userId: string,
    postId: number,
    content: string
  ): Promise<IReturnMessage> {
    await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });

    return { message: "Successfuly added comment" };
  }

  public static async removeComment(
    commentId: number,
    userId: string
  ): Promise<IReturnMessage> {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return { message: "Successfuly removed comment" };
  }

  public static async editComment(
    comment: Comment,
    changes: CommentChanges
  ): Promise<IReturnMessage> {
    if (
      Object.keys(changes).length === 0 ||
      comment.content === changes.content
    ) {
      return { message: "Nothing changed" };
    }

    await prisma.comment.update({
      where: {
        id: comment.id,
      },

      data: {
        content: changes.content,
      },
    });

    return { message: "Successfuly changed content of the comment" };
  }

  public static async findLikeByCommentAndUserId(
    commentId: number,
    userId: string
  ): Promise<CommentLike | null> {
    return await prisma.commentLike.findFirst({
      where: {
        commentId: commentId,
        userId: userId,
      },
    });
  }

  public static async likeComment(
    commentId: number,
    userId: string
  ): Promise<IReturnMessage> {
    await prisma.commentLike.create({
      data: {
        commentId: commentId,
        userId: userId,
      },
    });

    return { message: "Successfuly liked comment" };
  }

  public static async dislikeComment(
    like: CommentLike
  ): Promise<IReturnMessage> {
    await prisma.commentLike.delete({
      where: {
        id: like.id,
      },
    });
    return { message: "Successfuly disliked comment" };
  }
}
