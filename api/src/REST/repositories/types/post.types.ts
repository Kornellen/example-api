import { PostComment } from "./comment.types";
import { PostLikeId } from "./like.types";

export interface PublicPost {
  createdAt: Date;
  content: string;
  author: { username: string };
  title: string;
  _count: { likes: number; comments: number };
}

export interface PostBasic {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  authorId: string;
  author: {
    username: string;
    role: string;
  };
  published: boolean;
  content: string;
  _count: {
    comments: number;
    likes: number;
  };
}

export type PostDetails = [PostBasic, PostLikeId[], PostComment[]];
