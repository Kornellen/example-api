import { ICommentRepository } from "@app/interfaces/repositories";
import { CommentService } from "../comment.services";
import { Comment } from "@prisma/client";

const mockRepo: jest.Mocked<ICommentRepository> = {
  createComment: jest.fn(),
  dislikeComment: jest.fn(),
  editComment: jest.fn(),
  findCommentById: jest.fn(),
  findLikeByCommentAndUserId: jest.fn(),
  likeComment: jest.fn(),
  removeComment: jest.fn(),
};

const service = new CommentService(mockRepo);

const mockComment: Comment = {
  id: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: "ghdsh136dchds",
  content: "HEllo Test",
  postId: 1,
};

const otherUserId = "gwe6236589cxs";

describe("CommentService", () => {
  describe("createComment ", () => {
    it("should create comment and return response", async () => {
      const expectedMsg = { message: "Successfuly added comment" };

      mockRepo.createComment.mockResolvedValue(expectedMsg);

      const result = await service.addComment(
        mockComment.authorId,
        mockComment.content,
        mockComment.postId
      );
      expect(result).toEqual(expectedMsg);
      expect(mockRepo.createComment).toHaveBeenCalledTimes(1);
      expect(mockRepo.createComment).toHaveBeenCalledWith(
        mockComment.authorId,
        mockComment.postId,
        mockComment.content
      );
    });
  });

  describe("removeComment", () => {
    it("should remove comment", async () => {
      const expectedMsg = { message: "Successfuly removed comment" };

      mockRepo.findCommentById.mockResolvedValue(mockComment);

      mockRepo.removeComment.mockResolvedValue(expectedMsg);

      const result = await service.removeComment(
        mockComment.id,
        mockComment.authorId
      );

      expect(result).toEqual(expectedMsg);
      expect(mockRepo.removeComment).toHaveBeenCalledTimes(1);
      expect(mockRepo.removeComment).toHaveBeenCalledWith(mockComment.id);
    });

    it("should throw 404 http error", async () => {
      mockRepo.findCommentById.mockResolvedValue(null);

      await expect(
        service.removeComment(mockComment.id, mockComment.authorId)
      ).rejects.toMatchObject({
        message: "Comment not found",
        statusCode: 404,
      });
    });

    it("should throw 401 http error", async () => {
      mockRepo.findCommentById.mockResolvedValue(mockComment);

      await expect(
        service.removeComment(mockComment.id, otherUserId)
      ).rejects.toMatchObject({ message: "Unauthorized", statusCode: 401 });
    });
  });
});
