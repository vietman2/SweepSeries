import { AcademyProfileType } from "./academy";

export type CoachProfessionType = {
  id: number;
  kor_name: string;
};

// 프로모드 Front에서 사용
export type CoachProfileType = {
  uuid: string;
  name: string;
  profile_image: string;
  academy: AcademyProfileType;
};

export type CoachSimpleType = {
  uuid: string;
  name: string;
  profile_image: string;
  career: string;
  introduction: string;
  professions: CoachProfessionType[];
  is_liked: boolean;
  rating: number;
  num_reviews: number;
  academy_uuid: string;
};

export type CoachDetailType = {
  uuid: string;
  name: string;
  profile_image: string;
  professions: CoachProfessionType[];
  is_liked: boolean;
  rating: number;
  num_reviews: number;
  introduction: string;
  instagram: string;
  blog: string;
};
