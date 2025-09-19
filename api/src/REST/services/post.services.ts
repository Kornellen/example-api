import { HttpError } from "../helpers/HttpError";
import { PostRepository } from "../repositories/post.repository";

export class PostService {
  public async createPost(
    userId: string,
    title: string,
    published: boolean,
    content: string
  ): Promise<{ message: string; postId: number }> {
    try {
      const newPost = await PostRepository.createPost(
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
  public async changePostVisability(postId: number): Promise<IReturnMessage> {
    try {
      const post = await PostRepository.findPostById(postId);

      if (!post) throw new HttpError("Post Not Found", 404);

      return await PostRepository.changePostVisability(post);
    } catch (error) {
      throw error;
    }
  }

  // Likes Post
  public async likePost(
    userId: string,
    postId: number
  ): Promise<IReturnMessage> {
    try {
      const like = await PostRepository.findPostLikeByUserAndId(postId, userId);

      // Checking if user liked post before. If yes, remove like
      if (like) return PostRepository.dislikePost(like.id);

      return await PostRepository.likePost(postId, userId);
    } catch (error) {
      throw error;
    }
  }

  // Getting Post Datas
  public async getPostData(postId: number) {
    const post = await PostRepository.loadPostData(postId);

    if (!post) return { error: "Post Not Found" };

    return post;
  }

  // Updating post
  public async updatePost(
    postId: number,
    userId: string,
    change: { title: string | null; content: string | null }
  ): Promise<IReturnMessage> {
    try {
      const post = await PostRepository.findPostById(postId);

      if (!post) throw new HttpError("Post Not Found", 404);

      if (post.authorId !== userId)
        throw new HttpError("Invalid Credentials", 401);

      return PostRepository.updatePost(postId, change);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Removing post
  public async removePost(
    postId: number,
    userId: string
  ): Promise<IReturnMessage> {
    if (!postId || !userId) throw new HttpError("Bad Request", 400);

    const post = await PostRepository.findPostByAuthorAndId(postId, userId);

    if (!post) throw new HttpError("Post Not Found", 404);

    return await PostRepository.removePost(post, userId);
  }

  // Fetching public posts
  public async getPublicPost() {
    const posts = await PostRepository.findPublicPosts();

    return posts;
  }
}
