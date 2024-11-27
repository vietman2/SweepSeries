import { CommentType, ReCommentType } from "@models/community";
import { sampleAuthor } from "@testdata/auth";

export const sampleRecomments: ReCommentType[] = [
  {
    id: 1,
    author: sampleAuthor,
    content: "대댓글 내용입니다.",
    created_at: "5분 전",
    num_likes: 1,
    is_liked: false,
    is_author: true,
    is_deleted: false,
  },
  {
    id: 2,
    author: sampleAuthor,
    content: "대댓글 내용입니다.",
    created_at: "5분 전",
    num_likes: 1,
    is_liked: true,
    is_author: false,
    is_deleted: true,
  },
];

export const sampleComments: CommentType[] = [
  {
    id: 1,
    author: sampleAuthor,
    content: "댓글 내용입니다.",
    created_at: "5분 전",
    num_likes: 1,
    num_recomments: 2,
    recomments: sampleRecomments,
    is_liked: true,
    is_author: true,
    is_deleted: false,
  },
  {
    id: 2,
    author: sampleAuthor,
    content: "댓글 내용입니다.",
    created_at: "5분 전",
    num_likes: 1,
    num_recomments: 2,
    recomments: [],
    is_liked: false,
    is_author: true,
    is_deleted: true,
  },
];
