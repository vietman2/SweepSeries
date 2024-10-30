import { InquirySimpleType } from "@models/customers";

export const sampleInquiries: InquirySimpleType[] = [
  {
    id: 1,
    title: "예약했는데, 아카데미 측에서 안됐대요",
    status: "답변완료",
    category: "예약",
  },
  {
    id: 2,
    title: "예약취소 이거 왜 안돼죠?",
    status: "답변예정",
    category: "예약",
  },
];
