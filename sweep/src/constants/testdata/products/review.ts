import { ReviewType, ReplyType } from "@models/products";

const sampleReply: ReplyType = {
  id: 1,
  author_name: "홍길동 코치 (Catch B 아카데미)",
  date: "2024-10-01",
  content:
    "리뷰를 달아주었구나! 홍길동 코치님이야! :)\n항상 열심히 하는 꺽정이! 처음엔 항상 꺽정이를 볼 때마다 걱정이 넘쳤는데 꺾이지 않는 마음으로 매 훈련을 끝까지 격정적으로 소화해내는 모습을 보면 너무 뿌듯하구나. 앞으로도 지금 모습 변치않고 코치님과 열심히 해보자!! ",
};

export const sampleReviews: ReviewType[] = [
  {
    id: 1,
    author_nickname: "레슨만 마흔번째",
    author_profile: "https://picsum.photos/200",
    date: "2024-10-01",
    rating: 5,
    lesson: "엘리트선수(중학생) 1:1 개인레슨 (60분)",
    coach: "홍길동 코치",
    tags: ["피드백이 좋아요", "시설이 깔끔해요"],
    images: ["https://picsum.photos/200", "https://picsum.photos/300"],
    content:
      "역시 길동코치님, 트레이닝맛집도 같이 운영하시나봐요 :)\n레슨받은지 3개월 됐는데 정말 비약적인 성장을 했습니다.\n고1인데 벌써 시합조네요. 드래프트 받는 그날까지 잘 부탁드리겠습니다. 캐치비 아카데미, 길동 코치님 화이또!!!",
    reply: sampleReply,
  },
];
