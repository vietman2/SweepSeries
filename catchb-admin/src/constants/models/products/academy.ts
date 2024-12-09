import { UserRelatedType } from "@models/members";

export type AcademyType = {
  uuid: string;
  name: string;
  owner: UserRelatedType;
  is_verified: boolean;
  is_rejected: boolean;
  certification?: string;
  verified_at?: string;
  rejected_at?: string;
  reject_reason?: string;
};
