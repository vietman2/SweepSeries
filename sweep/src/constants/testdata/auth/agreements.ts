import { AgreementSimpleType } from "@models/auth";

export const sampleAgreements: AgreementSimpleType[] = [
  {
    id: 1,
    title: "약관 1",
    required: true,
    has_content: true,
  },
  {
    id: 2,
    title: "약관 2",
    required: false,
    has_content: false,
  },
];
