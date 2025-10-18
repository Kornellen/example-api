import { HttpError } from "../helpers/HttpError";
import { IPostRepository } from "@app/interfaces/repositories";
import { IPostService } from "@app/interfaces/services";

export class PostService implements IPostService {
  constructor(private postRepo: IPostRepository) {}
  public async createPost(
    userId: string,
    title: string,
    published: boolean,
    content: string
  ): Promise<{ message: string; postId: number }> {
    try {
      const newPost = await this.postRepo.createPost(
        title,
        content,
        published,
        userId
      );

      return { message: "Successfully created post", postId: newPost.id };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Changing Visability of the post (public, private)
  public async changePostVisability(postId: number): Promise<ReturnMessage> {
    try {
      const post = await this.postRepo.findPostById(postId);

      if (!post) throw new HttpError("Post Not Found", 404);

      return await this.postRepo.changePostVisability(post);
    } catch (error) {
      throw error;
    }
  }

  // Likes Post
  public async likePost(
    userId: string,
    postId: number
  ): Promise<ReturnMessage> {
    try {
      const like = await this.postRepo.findPostLikeByUserAndId(postId, userId);

      // Checking if user liked post before. If yes, remove like
      if (like) return this.postRepo.dislikePost(like.id);

      return await this.postRepo.likePost(postId, userId);
    } catch (error) {
      throw error;
    }
  }

  // Getting Post Datas
  public async getPostData(postId: number) {
    const post = await this.postRepo.loadPostData(postId);

    if (!post) return { error: "Post Not Found" };

    return post;
  }

  // Updating post
  public async updatePost(
    postId: number,
    userId: string,
    change: { title: string | null; content: string | null }
  ): Promise<ReturnMessage> {
    try {
      const post = await this.postRepo.findPostById(postId);

      if (!post) throw new HttpError("Post Not Found", 404);

      if (post.authorId !== userId)
        throw new HttpError("Invalid Credentials", 401);

      return this.postRepo.updatePost(postId, change);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Removing post
  public async removePost(
    postId: number,
    userId: string
  ): Promise<ReturnMessage> {
    if (!postId || !userId) throw new HttpError("Bad Request", 400);

    const post = await this.postRepo.findPostByAuthorAndId(postId, userId);

    if (!post) throw new HttpError("Post Not Found", 404);

    return await this.postRepo.removePost(post, userId);
  }

  // Fetching public posts
  public async getPublicPost() {
    const posts = await this.postRepo.findPublicPosts();

    return posts;
  }
}
