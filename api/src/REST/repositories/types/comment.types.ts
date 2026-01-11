export type CommentChanges = { content: string };

export interface PostComment {
  id: number;
  content: string;
  createdAt: Date;
  author: { username: string };
  _count: { likes: number };
}
