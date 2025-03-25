export type ReviewType = {
  id: number;
  author_nickname: string;
  author_profile: string;
  date: string;
  rating: number;
  lesson: string;
  coach: string;
  tags: string[];
  images: string[];
  content: string;
  reply?: ReplyType;
};

export type ReplyType = {
  id: number;
  author_name: string;
  date: string;
  content: string;
};

export type TagType = {
  id: number;
  tag: string;
};

export type TagOptionsType = {
  lesson: {
    positives: TagType[];
    negatives: TagType[];
  };
  coach: {
    positives: TagType[];
    negatives: TagType[];
  };
  academy: {
    positives: TagType[];
    negatives: TagType[];
  };
};
