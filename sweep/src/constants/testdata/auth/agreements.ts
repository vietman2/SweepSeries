import { AgreementSimpleType, AgreementType } from "@models/auth";

export const sampleAgreements: AgreementSimpleType[] = [
  {
    id: 1,
    title: "약관 1",
    required: true,
    has_content: true,
  },
  {
    id: 2,
    title: "알림 수신 동의",
    required: false,
    has_content: false,
  },
];

export const sampleAgreement: AgreementType = {
  title: "약관 1",
  content: "약관 1 내용",
  last_updated: "2021-09-01",
};
