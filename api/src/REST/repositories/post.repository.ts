import { prisma } from "@app/db";
import { IPostRepository } from "@app/interfaces/repositories";
import { PublicPosts } from "./types/post.types";
import { Post, PostLike } from "@app/db/models";
import { cacheData } from "src/utils/infrastructure/cacheData";
import { CommentDTO, LikeDTO, PostDTO } from "types/dtos/";

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

  public async findPublicPosts(): Promise<PublicPosts> {
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
    await prisma.postLike.create({
      data: {
        postId: postId,
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
  private async getPostBasic(postId: number, userId: string) {
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
  private async getPostLikes(
    postId: number
  ): Promise<{ user: { username: string } }[]> {
    return prisma.postLike.findMany({
      where: { postId },
      select: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }
  private async getPostComments(postId: number) {
    return prisma.comment.findMany({
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
    });
  }
  public async loadPostData(
    postId: number,
    userId: string
  ): Promise<PostDTO | null> {
    const postBasic = await this.getPostBasic(postId, userId);

    if (!postBasic) return null;

    const cacheKey = postBasic.published
      ? `post:public:${postId}`
      : `post:private:${postId}:user:${userId}`;

    const result = await cacheData(
      cacheKey,
      () =>
        Promise.all([
          Promise.resolve(postBasic),
          this.getPostLikes(postId),
          this.getPostComments(postId),
        ]),
      60
    );

    if (!result) return null;

    const [post, likes, comments] = result;

    const postDTO: PostDTO = {
      id: post.id,
      author: {
        userId: post.authorId,
        username: post.author.username,
        role: post.author.role,
      },
      comments: comments.map(
        (comment): CommentDTO => ({
          content: comment.content,
          createdAt: comment.createdAt,
          likes: comment._count.likes,
          username: comment.author.username,
        })
      ),
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likes: likes.map((like): LikeDTO => ({ username: like.user.username })),
      title: post.title,
      numOfComments: post._count.comments,
      numOfLikes: post._count.likes,
      published: post.published,
    };

    return postDTO;
  }
}
