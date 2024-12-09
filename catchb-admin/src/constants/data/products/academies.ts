import { AcademyType } from "@models/products";

export const sampleAcademies: AcademyType[] = [
  {
    uuid: "1",
    name: "아카데미1",
    owner: {
      uuid: "1",
      name: "홍길동",
      username: "hong",
    },
    is_verified: true,
    is_rejected: false,
    certification: "test",
    verified_at: "2021-09-01",
    rejected_at: "",
    reject_reason: "",
  },
];
