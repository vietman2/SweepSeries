import { sampleTags } from "./tags";
import { sampleProfile, sampleUserRelated } from "@data/members";
import {
  PostReportType,
  CommentReportType,
  ReCommentReportType,
} from "@models/community";

const commonFields = {
  id: 1,
  reason: "욕설",
  details: "욕설이 포함된 게시글입니다.",
  report_user: sampleUserRelated,
  status: "검토중",
  feedback: "",
};

export const samplePostReports: PostReportType[] = [
  {
    ...commonFields,
    post: {
      id: 1,
      tag: sampleTags[0],
      author: sampleProfile,
      title: "게시글 제목",
      content: "게시글 내용",
      created_at: "2021-08-01T00:00:00",
    },
  },
];

export const sampleCommentReports: CommentReportType[] = [
  {
    ...commonFields,
    comment: {
      id: 1,
      author: sampleProfile,
      content: "게시글 내용",
      created_at: "2021-08-01T00:00:00",
    },
  },
];

export const sampleReCommentReports: ReCommentReportType[] = [
  {
    ...commonFields,
    recomment: {
      id: 1,
      author: sampleProfile,
      content: "게시글 내용",
      created_at: "2021-08-01T00:00:00",
    },
  },
];
