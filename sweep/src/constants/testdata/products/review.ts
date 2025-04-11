import {
  ReviewResponseType,
  ReviewType,
  ReviewSummaryType,
  TagOptionsType,
  ReviewTagType,
} from "@models/products";
import { sampleStudents } from "./students";

/*const sampleReply: ReplyType = {
  id: 1,
  author_name: "홍길동 코치 (Catch B 아카데미)",
  date: "2024-10-01",
  content:
    "리뷰를 달아주었구나! 홍길동 코치님이야! :)\n항상 열심히 하는 꺽정이! 처음엔 항상 꺽정이를 볼 때마다 걱정이 넘쳤는데 꺾이지 않는 마음으로 매 훈련을 끝까지 격정적으로 소화해내는 모습을 보면 너무 뿌듯하구나. 앞으로도 지금 모습 변치않고 코치님과 열심히 해보자!! ",
};*/

const sampleReviewTags: ReviewTagType[] = [
  {
    id: 1,
    tag: "피드백이 좋아요",
  },
  {
    id: 2,
    tag: "시설이 깔끔해요",
  },
  {
    id: 3,
    tag: "피드백이 부족해요",
  },
  {
    id: 4,
    tag: "시설이 불편해요",
  },
];

export const sampleTagOptions: TagOptionsType = {
  lesson: {
    positives: [sampleReviewTags[0], sampleReviewTags[1]],
    negatives: [sampleReviewTags[2], sampleReviewTags[3]],
  },
  coach: {
    positives: [sampleReviewTags[0], sampleReviewTags[1]],
    negatives: [sampleReviewTags[2], sampleReviewTags[3]],
  },
  academy: {
    positives: [sampleReviewTags[0], sampleReviewTags[1]],
    negatives: [sampleReviewTags[2], sampleReviewTags[3]],
  },
};

export const sampleReviews: ReviewType[] = [
  {
    id: 1,
    reviewer: sampleStudents[0],
    created_at: "2024-10-01",
    rating: 5,
    comment:
      "코치님 너무 친절하시고, 시설도 너무 좋아요. 다음에 또 방문하겠습니다.",
    tags: [sampleReviewTags[0], sampleReviewTags[1]],
    images: ["https://picsum.photos/200", "https://picsum.photos/300"],
  },
];

export const sampleReviewSummary: ReviewSummaryType = {
  uuid: 1,
  average_rating: 5,
  summary: {
    rating_5: 4,
    rating_4: 3,
    rating_3: 2,
    rating_2: 1,
    rating_1: 0,
    total: 10,
  },
};

export const sampleReviewResponse: ReviewResponseType = {
  count: 1,
  next: "next-url",
  previous: "",
  results: sampleReviews,
  summary: sampleReviewSummary,
};
