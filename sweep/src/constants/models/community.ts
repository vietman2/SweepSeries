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
