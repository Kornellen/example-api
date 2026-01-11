import { Post, PostLike } from "@app/db/models";
import { PostBasic, PostDetails, PublicPost } from "../types/post.types";

export interface IPostRepository {
  findPostById(postId: number): Promise<Post | null>;
  findPostByAuthorAndId(postId: number, userId: string): Promise<Post | null>;

  findUserPosts(userId: string): Promise<PostBasic[] | null>;

  findPostLikeByUserAndId(
    postId: number,
    userId: string
  ): Promise<PostLike | null>;

  findPublicPosts(): Promise<PublicPost[] | null>;

  createPost(
    title: string,
    content: string,
    published: boolean,
    userId: string
  ): Promise<Post>;

  updatePost(
    postId: number,
    change: { title: string | null; content: string | null }
  ): Promise<ReturnMessage>;

  changePostVisability(post: Post): Promise<ReturnMessage>;

  removePost(post: Post, userId: string): Promise<ReturnMessage>;

  likePost(postId: number, userId: string): Promise<{ message: string }>;

  dislikePost(likeId: number): Promise<ReturnMessage>;

  loadPostData(postId: number, userId: string): Promise<PostDetails | null>;
}
