import { prisma } from "@app/db";
import { IPostRepository } from "@app/interfaces/repositories";
import { PostBasic, PostDetails, PublicPost } from "./types/post.types";
import { Comment, Post, PostLike } from "@app/db/models";
import { cacheData } from "src/utils/infrastructure/cacheData";
import { PostLikeId } from "./types/like.types";
import { PostComment } from "./types/comment.types";

export class PostRepository implements IPostRepository {
  constructor() {}
  public async findPostById(postId: number): Promise<Post | null> {
    return cacheData(
      `post:${postId}`,
      (): Promise<Post | null> =>
        prisma.post.findUnique({ where: { id: postId } }),
      60
    );
  }

  public async findPostByAuthorAndId(
    postId: number,
    userId: string
  ): Promise<Post | null> {
    return cacheData(
      `post:${postId}`,
      async (): Promise<Post | null> =>
        prisma.post.findUnique({
          where: {
            id: postId,
            authorId: userId,
          },
        }),
      60
    );
  }

  public async findPostLikeByUserAndId(
    postId: number,
    userId: string
  ): Promise<PostLike | null> {
    return await prisma.postLike.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });
  }

  public async findUserPosts(userId: string): Promise<PostBasic[] | null> {
    const cacheKey = `posts:public:user:${userId}`;

    return await cacheData(
      cacheKey,
      (): Promise<PostBasic[]> =>
        Promise.resolve(
          prisma.post.findMany({
            where: {
              authorId: userId,
            },
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              title: true,
              content: true,
              published: true,
              authorId: true,
              author: {
                select: {
                  username: true,
                  role: true,
                },
              },
              _count: {
                select: {
                  comments: true,
                  likes: true,
                },
              },
            },
          })
        ),
      60
    );
  }

  public async findPublicPosts(): Promise<PublicPost[] | null> {
    return await prisma.post.findMany({
      select: {
        createdAt: true,
        content: true,
        author: {
          select: {
            username: true,
          },
        },
        title: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      where: {
        published: true,
      },
    });
  }

  public async createPost(
    title: string,
    content: string,
    published: boolean,
    userId: string
  ): Promise<Post> {
    return await prisma.post.create({
      data: {
        title: title,
        content: content,
        published: published,
        author: {
          connect: { id: userId },
        },
      },
    });
  }

  public async updatePost(
    postId: number,
    change: { title: string | null; content: string | null }
  ): Promise<ReturnMessage> {
    let updateData: any = {};

    if (change.title !== null) {
      updateData.title = change.title;
    }

    if (change.content !== null) {
      updateData.content = change.content;
    }

    if (Object.keys(updateData).length === 0) {
      return { message: "Nothing changed" };
    }

    await prisma.post.update({
      data: updateData,
      where: {
        id: postId,
      },
    });

    return { message: "Successfully updated" };
  }

  public async changePostVisability(post: Post): Promise<ReturnMessage> {
    await prisma.post.update({
      data: {
        published: !post.published,
      },
      where: {
        id: post.id,
      },
    });
    return { message: "Successfully chaged post visabilty" };
  }

  public async removePost(post: Post, userId: string): Promise<ReturnMessage> {
    await prisma.post.delete({
      where: {
        id: post.id,
        authorId: userId,
      },
    });

    return { message: "Succesfully removed post" };
  }

  public async likePost(
    postId: number,
    userId: string
  ): Promise<{ message: string }> {
    const post = await this.getPostBasic(postId, userId);

    if (!post) return { message: "Post Not Found" };

    await prisma.postLike.create({
      data: {
        postId: post.id,
        userId: userId,
      },
    });

    return { message: "Liked" };
  }

  public async dislikePost(likeId: number): Promise<ReturnMessage> {
    await prisma.postLike.delete({
      where: {
        id: likeId,
      },
    });

    return { message: "Disliked" };
  }
  private async getPostBasic(
    postId: number,
    userId: string
  ): Promise<PostBasic | null> {
    return prisma.post.findFirst({
      where: {
        id: postId,
        OR: [{ published: true }, { authorId: userId }],
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        title: true,
        content: true,
        published: true,
        authorId: true,
        author: {
          select: {
            username: true,
            role: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }
  private async getPostLikes(postId: number): Promise<PostLikeId[]> {
    return prisma.postLike.findMany({
      where: { postId },
    });
  }
  private async getPostComments(postId: number): Promise<PostComment[]> {
    const comments = await Promise.resolve(
      prisma.comment.findMany({
        where: { postId },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: { username: true },
          },
          _count: {
            select: { likes: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    );

    if (!comments) return [];

    return comments;
  }
  public async loadPostData(
    postId: number,
    userId: string
  ): Promise<PostDetails | null> {
    const postBasic = await this.getPostBasic(postId, userId);

    if (!postBasic) return null;

    const cacheKey = postBasic.published
      ? `post:public:${postId}`
      : `post:private:${postId}:user:${userId}`;

    const result = await cacheData(
      cacheKey,
      (): Promise<PostDetails> =>
        Promise.all([
          Promise.resolve(postBasic),
          this.getPostLikes(postId),
          this.getPostComments(postId),
        ]),
      60
    );

    if (!result) return null;

    return result;
  }
}
