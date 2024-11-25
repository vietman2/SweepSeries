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
  id: number;
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
  id: number;
  forum: string;
  author_uuid: string;
  author_nickname: string;
  title: string;
  content: string;

  tag: TagType;
  images: ImageType[];
  comments: CommentType[];

  num_comments: number;
  num_clicks: number;
  num_likes: number;

  is_liked: boolean;
  is_my_post: boolean;

  created_at: string;
  updated_at: string;
};
