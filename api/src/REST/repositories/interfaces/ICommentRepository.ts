import { Comment, CommentLike } from "@prisma/client";
import { CommentChanges } from "../types/comment.types";
export interface ICommentRepository {
  findCommentById(commentId: number): Promise<Comment | null>;

  createComment(
    userId: string,
    postId: number,
    content: string
  ): Promise<ReturnMessage>;

  removeComment(commentId: number): Promise<ReturnMessage>;

  editComment(
    comment: Comment,
    changes: CommentChanges
  ): Promise<ReturnMessage>;

  likeComment(commentId: number, userId: string): Promise<ReturnMessage>;
  dislikeComment(like: CommentLike): Promise<ReturnMessage>;

  findLikeByCommentAndUserId(
    commentId: number,
    userId: string
  ): Promise<CommentLike | null>;
}
