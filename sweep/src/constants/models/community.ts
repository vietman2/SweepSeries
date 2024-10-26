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
  author_uuid: string;
  author_nickname: string;
  title: string;
  content: string;
  tag: TagType;
  image: string | null;
  num_clicks: number;
  num_comments: number;
  num_likes: number;
  is_liked: boolean;
  created_at: string;
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

export type CommentType = {
  id: number;
  commenter_uuid: string;
  commenter_nickname: string;
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
  commenter_uuid: string;
  commenter_nickname: string;
  content: string;
  created_at: string;
  num_likes: number;

  is_liked: boolean;
  is_my_recomment: boolean;
};
