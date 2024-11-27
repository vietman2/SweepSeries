import { UserProfileType } from "@models/auth";

export type CommentType = {
  id: number;
  author: UserProfileType;
  content: string;
  created_at: string;
  num_likes: number;
  num_recomments: number;

  recomments: ReCommentType[];

  is_liked: boolean;
  is_author: boolean;
  is_deleted: boolean;
};

export type ReCommentType = {
  id: number;
  author: UserProfileType;
  content: string;
  created_at: string;
  num_likes: number;

  is_liked: boolean;
  is_author: boolean;
  is_deleted: boolean;
};
