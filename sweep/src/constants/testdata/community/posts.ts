import { sampleAuthor } from "./authors";
import { sampleComments } from "./comments";
import { TagType, PostSimpleType, PostDetailType } from "@models/community";

export const sampleTags: TagType[] = [
  {
    id: 1,
    forum_id: 1,
    name: "KBO",
    color: "#002561",
    bgcolor: "#b3a177",
    icon: "https://kr.object.ncloudstorage.com/sweepdev/community/tags/KBO.svg",
  },
  {
    id: 2,
    forum_id: 1,
    name: "MLB",
    color: "#ffffff",
    bgcolor: "#002d72",
    icon: "https://kr.object.ncloudstorage.com/sweepdev/community/tags/MLB.svg",
  },
  {
    id: 3,
    forum_id: 2,
    name: "용병모집",
    color: "#ffffff",
    bgcolor: "#002d72",
    icon: "https://kr.object.ncloudstorage.com/sweepdev/community/tags/MLB.svg",
  },
];

export const samplePosts: PostSimpleType[] = [
  {
    id: 1,
    author: sampleAuthor,
    title: "야구 장비 추천 좀 부탁드립니다!",
    content:
      "야구 장비에 대해 잘 모르는데 이번에 취미로 시작하려고 해요. 배트나 글러브, 유니폼 등 추천해줄 만한 제품이 있을까요? 가성비 좋은 걸로 알려주세요!",
    tag: sampleTags[0],
    image: null,
    created_at: "5분 전",
    num_comments: 1,
    num_likes: 1,
    num_views: 1,
    is_liked: true,
  },
  {
    id: 2,
    author: sampleAuthor,
    title: "야구장에서 먹는 음식, 뭐가 제일 맛있나요?",
    content:
      "야구 보러 갈 때마다 경기장 음식을 꼭 먹어야하는데, 다들 경기장에서 자주 먹는 음식이 있나요? 추천해주시면 다음에 시도해보려고요!",
    tag: sampleTags[1],
    image: "https://via.placeholder.com/150",
    created_at: "2024-10-23",
    num_comments: 1,
    num_likes: 1,
    num_views: 1,
    is_liked: false,
  },
  {
    id: 3,
    author: sampleAuthor,
    title: "야구 규칙 중에서 헷갈리는 부분 질문드립니다",
    content:
      "최근 경기에서 규칙을 잘못 이해해서 헷갈렸던 장면이 있었어요ㅠㅠ\n\n타자가 공을 맞았을 때 어떻게 되는지 규정 자세히 아시는 분 있나요?",
    tag: sampleTags[1],
    image: null,
    created_at: "2024-10-21",
    num_comments: 1,
    num_likes: 1,
    num_views: 1,
    is_liked: true,
  },
];

export const samplePostDetail: PostDetailType = {
  id: 1,
  author_uuid: "uuid",
  author_nickname: "작성자",
  title: "야구 장비 추천 좀 부탁드립니다!",
  content:
    "야구 보러 갈 때마다 경기장 음식을 꼭 먹어야하는데, 다들 경기장에서 자주 먹는 음식이 있나요? 추천해주시면 다음에 시도해보려고요!",
  tag: sampleTags[0],
  images: [
    { id: 1, url: "https://via.placeholder.com/150" },
    { id: 2, url: "https://via.placeholder.com/150" },
    { id: 3, url: "https://via.placeholder.com/150" },
  ],
  forum: "덕아웃",
  created_at: "5분 전",
  updated_at: "5분 전",
  num_comments: 1,
  num_likes: 1,
  num_clicks: 1,
  is_liked: true,
  is_my_post: true,
  comments: sampleComments,
};
