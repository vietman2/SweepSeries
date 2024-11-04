export type InquirySimpleType = {
  id: number;
  title: string;
  status: string;
  category: string;
};

export type AnnouncementSimpleType = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export type FAQType = {
  id: number;
  question: string;
  answer: string;
};

export type SettingType = {
  id: number;
  title: string;
  subTitle?: string;
  isSet: boolean;
};

export type SettingGroupType = {
  title: string;
  settings: SettingType[];
}
