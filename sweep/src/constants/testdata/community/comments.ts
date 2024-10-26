import { CommentType, ReCommentType } from "@models/community";

const sampleRecomments: ReCommentType[] = [
  {
    id: 1,
    commenter_uuid: "uuid",
    commenter_nickname: "대댓글쓴이",
    content: "대댓글 내용입니다.",
    created_at: "5분 전",
    num_likes: 1,
    is_liked: false,
  },
  {
    id: 2,
    commenter_uuid: "uuid",
    commenter_nickname: "대댓글쓴이",
    content: "대댓글 내용입니다.",
    created_at: "5분 전",
    num_likes: 1,
    is_liked: false,
  },
];

export const sampleComments: CommentType[] = [
  {
    id: 1,
    commenter_uuid: "uuid",
    commenter_nickname: "댓글쓴이",
    content: "댓글 내용입니다.",
    created_at: "5분 전",
    num_likes: 1,
    num_recomments: 2,
    recomments: sampleRecomments,
    is_liked: true,
  },
  {
    id: 2,
    commenter_uuid: "uuid",
    commenter_nickname: "댓글쓴이",
    content: "댓글 내용입니다.",
    created_at: "5분 전",
    num_likes: 1,
    num_recomments: 0,
    recomments: [],
    is_liked: false,
  },
];
