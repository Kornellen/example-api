export type PublicPosts =
  | {
      createdAt: Date;
      content: string;
      author: { username: string };
      title: string;
      _count: { likes: number; comments: number };
    }[]
  | null;
