import { prisma } from "@app/db";
import { ICommentRepository } from "@app/interfaces/repositories";
import { CommentChanges } from "./types/comment.types";
import { Comment, CommentLike } from "@app/db/models";

export class CommentRepository implements ICommentRepository {
  constructor() {}
  public async findCommentById(commentId: number): Promise<Comment | null> {
    return await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
  }

  public async createComment(
    userId: string,
    postId: number,
    content: string
  ): Promise<ReturnMessage> {
    await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });

    return { message: "Successfuly added comment" };
  }

  public async removeComment(commentId: number): Promise<ReturnMessage> {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return { message: "Successfuly removed comment" };
  }

  public async editComment(
    comment: Comment,
    changes: CommentChanges
  ): Promise<ReturnMessage> {
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

  public async findLikeByCommentAndUserId(
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

  public async likeComment(
    commentId: number,
    userId: string
  ): Promise<ReturnMessage> {
    await prisma.commentLike.create({
      data: {
        commentId: commentId,
        userId: userId,
      },
    });

    return { message: "Successfuly liked comment" };
  }

  public async dislikeComment(like: CommentLike): Promise<ReturnMessage> {
    await prisma.commentLike.delete({
      where: {
        id: like.id,
      },
    });
    return { message: "Successfuly disliked comment" };
  }
}
