import { NoticeType } from "@models/apps";

export const sampleNotices: NoticeType[] = [
  {
    id: 1,
    title: "공지사항 1",
    content: "공지사항 1 내용",
    created_at: "2024-08-01",
    updated_at: "2024-08-01",
    is_deleted: false,
  },
  {
    id: 2,
    title: "공지사항 2",
    content: "공지사항 2 내용",
    created_at: "2024-08-01",
    updated_at: "2024-08-01",
    is_deleted: true,
  },
];
