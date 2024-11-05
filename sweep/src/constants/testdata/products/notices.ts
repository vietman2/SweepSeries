import { NoticeSimpleType } from "@models/products";

export const sampleNotices: NoticeSimpleType[] = [
  {
    id: 1,
    type: "알림",
    title: "2024년 상반기 '레슨' 우수 아카데미 선정",
    content:
      "캐치비에서 뽑은 2024년 상반기 ‘레슨’ 우수 아카데미에 선정되어 레슨 50% 할인 이벤트 중입니다. 많은 참여부탁드립니다!",
    date: "2024.09.01",
    image: "https://picsum.photos/200",
  },
  {
    id: 2,
    type: "공지",
    title: "캐치비 베이스볼 아카데미 확장 공사 진행",
    content:
      "2024년 11월 5일부터 11월 20일까지 아카데미 내 잔디 필드 확장 및 웨이트 공간 확장을 위한 공사가 진행됩니다. 기존 공간은 그대로 이용가능합니다.",
    date: "2024.09.01",
    image: "https://picsum.photos/200",
  },
];
