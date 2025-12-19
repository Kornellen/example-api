import { HttpError } from "../helpers/HttpError";
import { ICommentRepository } from "@app/interfaces/repositories";
import { ICommentService } from "@app/interfaces/services";

export class CommentService implements ICommentService {
  // Adds new comment to Database
  constructor(private commentRepo: ICommentRepository) {}
  public async addComment(
    userId: string,
    content: string,
    postId: number
  ): Promise<ReturnMessage> {
    try {
      return await this.commentRepo.createComment(userId, postId, content);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Remove comment with proper id from Database
  public async removeComment(
    commentId: number,
    userId: string
  ): Promise<ReturnMessage> {
    const comment = await this.commentRepo.findCommentById(commentId);

    if (!comment) {
      throw new HttpError("Comment not found", 404);
    }

    if (userId !== comment?.authorId) {
      throw new HttpError("Unauthorized", 401);
    }

    return await this.commentRepo.removeComment(commentId);
  }

  // Update content of comment with proper id
  public async updateComment(
    commentId: number,
    changes: { content: string }
  ): Promise<ReturnMessage> {
    const comment = await this.commentRepo.findCommentById(commentId);

    if (!comment) throw new HttpError("Comment not found", 404);

    return await this.commentRepo.editComment(comment, changes);
  }

  // Like or Dislike proper comment (Adds or remove like from Database)
  public async likeComment(
    commentId: number,
    userId: string
  ): Promise<ReturnMessage> {
    const like = await this.commentRepo.findLikeByCommentAndUserId(
      commentId,
      userId
    );

    if (like) return await this.commentRepo.dislikeComment(like);

    return await this.commentRepo.likeComment(commentId, userId);
  }
}
