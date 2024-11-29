import { TagType } from "./post";
import { UserProfileType, UserRelatedType } from "@models/members";

type PostType = {
  id: number;
  tag: TagType;
  author: UserProfileType;
  title: string;
  content: string;
  created_at: string;
};

export type ReportType = {
  id: number;
  reason: string;
  details: string;
  report_user: UserRelatedType;
  status: string;
  feedback: string;
}

export type PostReportType = {
  post: PostType;
} & ReportType;

type CommentType = {
  id: number;
  author: UserProfileType;
  content: string;
  created_at: string;
};

export type CommentReportType = {
  comment: CommentType;
} & ReportType;

export type ReCommentReportType = {
  recomment: CommentType;
} & ReportType;
