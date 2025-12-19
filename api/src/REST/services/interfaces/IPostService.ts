import { PublicPosts } from "../../repositories/types/post.types";

export interface IPostService {
  createPost(
    userId: string,
    title: string,
    published: boolean,
    content: string
  ): Promise<{ message: string; postId: number }>;

  changePostVisability(postId: number): Promise<ReturnMessage>;

  likePost(userId: string, postId: number): Promise<ReturnMessage>;

  getPostData(postId: number): any;

  updatePost(
    postId: number,
    userId: string,
    change: { title: string | null; content: string | null }
  ): Promise<ReturnMessage>;

  removePost(postId: number, userId: string): Promise<ReturnMessage>;

  getPublicPost(): Promise<PublicPosts>;
}
