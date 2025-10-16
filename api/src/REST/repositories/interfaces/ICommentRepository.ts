import { Comment, CommentLike } from "@prisma/client";
import { CommentChanges } from "../comment.repository";
export interface ICommentRepository {
  findCommentById(commentId: number): Promise<Comment | null>;

  createComment(
    userId: string,
    postId: number,
    content: string
  ): Promise<IReturnMessage>;

  removeComment(commentId: number): Promise<IReturnMessage>;

  editComment(
    comment: Comment,
    changes: CommentChanges
  ): Promise<IReturnMessage>;

  likeComment(commentId: number, userId: string): Promise<IReturnMessage>;
  dislikeComment(like: CommentLike): Promise<IReturnMessage>;

  findLikeByCommentAndUserId(
    commentId: number,
    userId: string
  ): Promise<CommentLike | null>;
}
