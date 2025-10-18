import { Post, PostLike } from "@prisma/client";
import { prisma } from "@app/db";
import { IPostRepository } from "@app/interfaces/repositories";
import { PublicPosts } from "./types/post.types";

export class PostRepository implements IPostRepository {
  constructor() {}
  public async findPostById(postId: number): Promise<Post | null> {
    return await prisma.post.findUnique({ where: { id: postId } });
  }

  public async findPostByAuthorAndId(
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

  public async loadPostData(postId: number) {
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
