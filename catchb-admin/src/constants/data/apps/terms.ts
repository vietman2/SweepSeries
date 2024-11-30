import { TermType } from "@models/apps";

export const sampleTerms: TermType[] = [
  {
    id: 1,
    title: "필수 약관 1",
    content: "필수 약관 1 내용",
    required: true,
    created_at: "2024-08-01",
    updated_at: "2024-08-01",
    deleted: false,
    history: [
      {
        id: 1,
        created_at: "2024-08-01",
        summary: "필수 약관 1 수정 내역 1",
      },
      {
        id: 2,
        created_at: "2024-08-01",
        summary: "필수 약관 1 수정 내역 2",
      },
    ],
  },
  {
    id: 2,
    title: "선택 약관 2",
    content: "선택 약관 2 내용",
    required: false,
    created_at: "2024-08-01",
    updated_at: "2024-08-01",
    deleted: false,
    history: [],
  },
  {
    id: 3,
    title: "삭제된 약관 3",
    content: "삭제된 약관 3 내용",
    required: true,
    created_at: "2024-08-01",
    updated_at: "2024-08-01",
    deleted: true,
    history: [],
  },
];
