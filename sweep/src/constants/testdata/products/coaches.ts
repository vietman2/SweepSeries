import {
  CoachDetailType,
  CoachProfessionType,
  CoachRequestType,
  CoachSimpleType,
} from "@models/products";

const sampleCoachProfessions: CoachProfessionType[] = [
  {
    id: 1,
    kor_name: "투수 전문",
  },
  {
    id: 2,
    kor_name: "타격 전문",
  },
  {
    id: 3,
    kor_name: "수비 전문",
  },
  {
    id: 4,
    kor_name: "포수 전문",
  },
  {
    id: 5,
    kor_name: "트레이닝 전문",
  },
];

export const sampleCoaches: CoachSimpleType[] = [
  {
    uuid: "1",
    name: "김선근",
    profile_image:
      "https://i.namu.wiki/i/Gi_zEqsd9H46GcmFjGefP7Y7RKlTOvzeHA1-yNtL9L_-K4k-_N16xn54WDZkR9aJJQYplpRcyW46AfhwTg2fZw.webp",
    career: "프로선수 출신",
    introduction: "김코치만의 특별한 커리큘럼\n전문지도자자격증 1급",
    professions: [sampleCoachProfessions[0], sampleCoachProfessions[1]],
    is_liked: true,
    rating: 4.5,
    num_reviews: 10,
  },
  {
    uuid: "2",
    name: "남병현",
    profile_image:
      "https://i.namu.wiki/i/1aFaRJqAAAf68HKwP8C7A9z5qlCcduUDSZ3YkVqmRNuTSftbpCq_ZTB_eYNu0JpR-dN_CH3YgvrQCDPAXpnHuw.webp",
    career: "프로선수 출신",
    introduction: "프로선수가 되고 싶다면!\n누구보다 야구를 잘하고 싶다면!",
    professions: [sampleCoachProfessions[2], sampleCoachProfessions[3]],
    is_liked: false,
    rating: 4.91,
    num_reviews: 19,
  },
  {
    uuid: "3",
    name: "유태순",
    profile_image:
      "https://i.namu.wiki/i/TOJzoFxf7M3_fGhaJt0oSsVR5hFFIWjBZDiwyDdYYL7vG_VW0cNDjxFLiigQwDxfLft0Sr6NYzhdQ84Qe9qN0w.webp",
    career: "대학선수 출신",
    introduction: "완성도 높은 수비 실력!",
    professions: [sampleCoachProfessions[4]],
    is_liked: true,
    rating: 3.1,
    num_reviews: 10,
  },
];

export const sampleCoachDetail: CoachDetailType = {
  uuid: "1",
  name: "홍길동",
  profile_image:
    "https://i.namu.wiki/i/Gi_zEqsd9H46GcmFjGefP7Y7RKlTOvzeHA1-yNtL9L_-K4k-_N16xn54WDZkR9aJJQYplpRcyW46AfhwTg2fZw.webp",
  introduction:
    "인천 서구 청라  최고의 실내 야구레슨 코치 홍길동 입니다.\n전문지도사 1급 자격증을 보유하고 있으며 전문적인 커리큘럼을 통해 실력을 향상시켜 드릴 수 있습니다.\n\n모든 커리큘럼은 해당 레슨의 실력, 구력을 확인한 이후 개인별 맞춤형으로 재구성될 수 있습니다.\n<투수레슨 커리큘럼>\n1회차: 숄더 코킹 및 로테이션 강화 ",
  professions: [sampleCoachProfessions[0], sampleCoachProfessions[1]],
  is_liked: true,
  rating: 4.5,
  num_reviews: 10,
};

export const sampleCoachRequests: CoachRequestType[] = [
  {
    uuid: "4",
    name: "이대호",
    profile_image:
      "https://i.namu.wiki/i/1aFaRJqAAAf68HKwP8C7A9z5qlCcduUDSZ3YkVqmRNuTSftbpCq_ZTB_eYNu0JpR-dN_CH3YgvrQCDPAXpnHuw.webp",
    career: "프로선수 출신",
    professions: [sampleCoachProfessions[2], sampleCoachProfessions[3]],
  },
  {
    uuid: "5",
    name: "박찬호",
    profile_image:
      "https://i.namu.wiki/i/TOJzoFxf7M3_fGhaJt0oSsVR5hFFIWjBZDiwyDdYYL7vG_VW0cNDjxFLiigQwDxfLft0Sr6NYzhdQ84Qe9qN0w.webp",
    career: "대학선수 출신",
    professions: [sampleCoachProfessions[4]],
  },
];
