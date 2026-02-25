import { PostBasic } from "src/REST/repositories/types/post.types";

export interface UserPublicDTO {
  id: string;
  username: string;
  posts: PostBasic[];
  role: string;
  email: string;
  commentsCount: number;
}

export interface UserPrivateDTO extends UserPublicDTO {
  first_name: string | null;
  last_name: string | null;
  city: string | null;
  age: number | null;
  loginMethodName: string;
  postsCount: number;
}

export interface AuthorDTO {
  userId: string;
  username: string;
  role: string;
}
