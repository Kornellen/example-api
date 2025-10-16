import { CommentRepository } from "../../REST/repositories/comment.repository";
import {
  ICommentRepository,
  IPostRepository,
} from "../../REST/repositories/interfaces";
import { PostRepository } from "../../REST/repositories/post.repository";
import { CommentService } from "../../REST/services/comment.services";
import { ICommentService, IPostService } from "../../REST/services/interfaces";
import { PostService } from "../../REST/services/post.services";
import { container } from "./DIContainer";

container.bind<ICommentRepository>(
  "ICommentRepository",
  () => new CommentRepository()
);

container.bind<ICommentService>("CommentService", (c) => {
  const repo = c.get<ICommentRepository>("ICommentRepository");

  return new CommentService(repo);
});

container.bind<IPostRepository>("IPostRepository", () => new PostRepository());

container.bind<IPostService>("PostService", (c) => {
  const repo = c.get<IPostRepository>("IPostRepository");
  return new PostService(repo);
});

export default {};
