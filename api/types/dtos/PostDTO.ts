import { AuthorDTO } from "./AuthorDTO";
import { CommentDTO } from "./CommentDTO";
import { LikeDTO } from "./LikeDTO";

export interface PostDTO {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  published: boolean;
  content: string;
  author: AuthorDTO;
  likes: LikeDTO[];
  comments: CommentDTO[];
  numOfComments: number;
  numOfLikes: number;
}
