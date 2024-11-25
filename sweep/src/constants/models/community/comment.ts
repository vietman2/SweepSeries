import { AuthorType } from "./author";

export type CommentType = {
  id: number;
  author: AuthorType;
  content: string;
  created_at: string;
  num_likes: number;
  num_recomments: number;

  recomments: ReCommentType[];

  is_liked: boolean;
  is_my_comment: boolean;
};

export type ReCommentType = {
  id: number;
  author: AuthorType;
  content: string;
  created_at: string;
  num_likes: number;

  is_liked: boolean;
  is_my_recomment: boolean;
};
