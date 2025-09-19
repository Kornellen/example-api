import { HttpError } from "../helpers/HttpError";
import { CommentRepository } from "../repositories/comment.repository";

export class CommentService {
  // Adds new comment to Database
  public async addComment(
    userId: string,
    content: string,
    postId: number
  ): Promise<IReturnMessage> {
    try {
      return await CommentRepository.createComment(userId, postId, content);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Remove comment with proper id from Database
  public async removeComment(
    commentId: number,
    userId: string
  ): Promise<IReturnMessage> {
    const comment = await CommentRepository.findCommentById(commentId);

    if (!userId) {
      throw new HttpError("Bad request", 400);
    }

    if (userId !== comment?.authorId) {
      throw new HttpError("Unauthorized", 401);
    }

    if (!comment) {
      throw new HttpError("Comment not found", 404);
    }

    return await CommentRepository.removeComment(commentId, userId);
  }

  // Update content of comment with proper id
  public async updateComment(
    commentId: number,
    changes: { content: string }
  ): Promise<IReturnMessage> {
    const comment = await CommentRepository.findCommentById(commentId);

    if (!comment) {
      throw new HttpError("Comment not found", 404);
    }

    if (
      typeof changes === undefined ||
      typeof changes === null ||
      !changes.content
    ) {
      throw new HttpError("Bad Request", 400);
    }

    return await CommentRepository.editComment(comment, changes);
  }

  // Like or Dislike proper comment (Adds or remove like from Database)
  public async likeComment(
    commentId: number,
    userId: string
  ): Promise<IReturnMessage> {
    const like = await CommentRepository.findLikeByCommentAndUserId(
      commentId,
      userId
    );

    if (like) return await CommentRepository.dislikeComment(like);

    return await CommentRepository.likeComment(commentId, userId);
  }
}
