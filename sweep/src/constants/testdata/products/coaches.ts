import { CoachProfessionType, CoachSimpleType } from "@models/products";

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
