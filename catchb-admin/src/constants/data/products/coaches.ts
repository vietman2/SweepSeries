import { CoachType } from "@models/products";

export const sampleCoaches: CoachType[] = [
  {
    uuid: "1",
    name: "John Doe",
    is_verified: true,
    is_rejected: false,
    academy: "My Academy",
    certificate: "Certified",
    verified_at: "2021-01-01",
    rejected_at: "",
    reject_reason: "",
  },
];
