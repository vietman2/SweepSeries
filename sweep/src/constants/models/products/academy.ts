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
  label: string;
  hours: string;
};

export type FacilityType = {
  id: number;
  name: string;
  kor_name: string;
  icon_url: string;
  type: string;
};

export type AcademyDetailType = {
  name: string;
  address: string;
  rating: number;
  num_reviews: number;
  introduction: string;
  working_hours: WorkingHoursType[];
  facilities: FacilityType[];
  map: string;
};
