export type NoticeType = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export const sampleNotices: NoticeType[] = [
  {
    id: 1,
    title: "공지 1 제목",
    content: "공지 1 내용",
    created_at: "2024-09-01",
    updated_at: "2024-09-01",
  },
  {
    id: 2,
    title: "공지 2 제목",
    content: "공지 2 내용",
    created_at: "2024-10-01",
    updated_at: "2024-10-01",
  },
];
