import { AuthorType } from "./author";
import { CommentType } from "./comment";

export type TagType = {
  id: number;
  forum_id: number;
  name: string;
  icon: string;
  color: string;
  bgcolor: string;
};

export type PostSimpleType = {
  id: string;
  tag: TagType;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
  author: AuthorType;
  num_views: number;
  num_comments: number;
  num_likes: number;
  is_liked: boolean;
};

type ImageType = {
  url: string;
  id: number;
};

export type PostDetailType = {
  id: string;
  tag: TagType;
  author: AuthorType;
  created_at: string;
  title: string;
  content: string;
  images: ImageType[];

  num_views: number;
  num_likes: number;
  num_comments: number;
  comments: CommentType[];
  is_liked: boolean;
  is_author: boolean;
};
