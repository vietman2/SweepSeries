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
