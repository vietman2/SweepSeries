import { ImagePickerAsset } from "expo-image-picker";
import { StudentSimpleType } from "./student";

export type TagType = {
  id: number;
  tag: string;
};

export type AcademyReviewType = {
  id: number;
  reviewer: StudentSimpleType;
  created_at: string; // 날짜만 반환됨
  academy_rating: number;
  academy_comment: string;
  academy_images: string[];
  academy_tags: TagType[];
  reply?: ReplyType;
};

export type AcademyReviewSummaryType = {
  uuid: number;
  average_rating: number;
  summary: {
    rating_5: number;
    rating_4: number;
    rating_3: number;
    rating_2: number;
    rating_1: number;
    total: number;
  };
};

export type ReviewResponseType = {
  count: number;
  next: string;
  previous: string;
};

export type ReplyType = {
  id: number;
  author_name: string;
  date: string;
  content: string;
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

export type ReviewInputType = {
  rating: number;
  comment: string;
  images: ImagePickerAsset[];
  tagIds: number[];
  secure?: boolean;
};
