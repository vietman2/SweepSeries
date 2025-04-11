import { ImageType } from "@models/app";

// 프로모드 Front에서 사용
export type AcademyProfileType = {
  uuid: string;
  name: string;
  logo: string;
}

export type AcademySimpleType = {
  uuid: string;
  name: string;
  rating: number;
  num_reviews: number;
  location: string;
  num_likes: number;
  is_liked: boolean;
  top_review: string;
  logo: string;
  last_session: string;
  remaining_sessions: number;
  num_students: number;
  num_requests: number;
};

export type WorkingHoursType = {
  day: string;
  schedule: string;
};

export type ScheduleDetailType = {
  open_time: string;
  close_time: string;
  is_closed: boolean;
  is_allday: boolean;
};

export type FacilityType = {
  id: number;
  name: string;
  kor_name: string;
  icon_url: string;
  type: string;
};

export type AcademyDetailType = {
  uuid: string;
  name: string;
  logo: string;
  images: ImageType[];
  address: string;
  rating: number;
  num_reviews: number;
  introduction: string;
  schedules: WorkingHoursType[];
  schedule_details: ScheduleDetailType[];
  convenience: FacilityType[];
  map: string;
  is_liked: boolean;
};
