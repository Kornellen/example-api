export interface ICommentService {
  addComment(
    userId: string,
    content: string,
    postId: number
  ): Promise<ReturnMessage>;

  removeComment(commentId: number, userId: string): Promise<ReturnMessage>;

  updateComment(
    commentId: number,
    changes: { content: string }
  ): Promise<ReturnMessage>;

  likeComment(commentId: number, userId: string): Promise<ReturnMessage>;
}
