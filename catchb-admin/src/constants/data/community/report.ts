import { sampleTags } from "./tags";
import { sampleProfile, sampleUserRelated } from "@data/members";
import { PostReportType } from "@models/community";

export const samplePostReports: PostReportType[] = [
  {
    id: 1,
    reason: "욕설",
    details: "욕설이 포함된 게시글입니다.",
    report_user: sampleUserRelated,
    post: {
      id: 1,
      tag: sampleTags[0],
      author: sampleProfile,
      title: "게시글 제목",
      content: "게시글 내용",
      created_at: "2021-08-01T00:00:00",
    },
    status: "처리중",
  },
];
