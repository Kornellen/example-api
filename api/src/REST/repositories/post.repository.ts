import { Post, PostLike } from "@prisma/client";
import { prisma } from "../../utils/infrastructure/prisma";

type PublicPostsType =
  | {
      createdAt: Date;
      content: string;
      author: { username: string };
      title: string;
      _count: { likes: number; comments: number };
    }[]
  | null;

export class PostRepository {
  public static async findPostById(postId: number): Promise<Post | null> {
    return await prisma.post.findUnique({ where: { id: postId } });
  }

  public static async findPostByAuthorAndId(
    postId: number,
    userId: string
  ): Promise<Post | null> {
    return await prisma.post.findUnique({
      where: {
        id: postId,
        authorId: userId,
      },
    });
  }
  public static async findPostLikeByUserAndId(
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

  public static async findPublicPosts(): Promise<PublicPostsType> {
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

  public static async createPost(
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

  public static async updatePost(
    postId: number,
    change: { title: string | null; content: string | null }
  ): Promise<IReturnMessage> {
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

  public static async changePostVisability(
    post: Post
  ): Promise<IReturnMessage> {
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

  public static async removePost(
    post: Post,
    userId: string
  ): Promise<IReturnMessage> {
    await prisma.post.delete({
      where: {
        id: post.id,
        authorId: userId,
      },
    });

    return { message: "Succesfully removed post" };
  }

  public static async likePost(
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

  public static async dislikePost(likeId: number): Promise<IReturnMessage> {
    await prisma.postLike.delete({
      where: {
        id: likeId,
      },
    });

    return { message: "Disliked" };
  }

  public static async loadPostData(postId: number) {
    return await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            username: true,
            role: true,
          },
        },
        likes: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
            post: {
              select: {
                id: true,
              },
            },
          },
        },
        comments: {
          select: {
            content: true,
            createdAt: true,
            author: {
              select: {
                username: true,
              },
            },
            _count: {
              select: {
                likes: true,
              },
            },
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
}
