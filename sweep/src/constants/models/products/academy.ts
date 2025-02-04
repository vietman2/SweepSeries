export type AcademySimpleType = {
  uuid: string;
  logo: string;
  name: string;
  location: string;
  rating: number;
  num_reviews: number;
  top_review: string;
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
  images: string[];
  address: string;
  rating: number;
  num_reviews: number;
  introduction: string;
  schedules: WorkingHoursType[];
  schedule_details: ScheduleDetailType[];
  convenience: FacilityType[];
  map: string;
};
