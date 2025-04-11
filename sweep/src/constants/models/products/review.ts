import { ImagePickerAsset } from "expo-image-picker";
import { StudentSimpleType } from "./student";

export type TagType = {
  id: number;
  tag: string;
};

export type ReviewType = {
  id: number;
  reviewer: StudentSimpleType;
  created_at: string; // 날짜만 반환됨
  rating: number;
  comment: string;
  images: string[];
  tags: TagType[];
  reply?: ReplyType;
};

export type ReviewSummaryType = {
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
  results: ReviewType[];
  summary: ReviewSummaryType;
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
