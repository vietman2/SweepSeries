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

export type PostReportType = {
  id: number;
  reason: string;
  details: string;
  report_user: UserRelatedType;
  post: PostType;
  status: string;
};
