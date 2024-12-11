export type CoachType = {
  uuid: string;
  name: string;
  is_verified: boolean;
  is_rejected: boolean;
  academy: string;
  certification?: string;
  verified_at?: string;
  rejected_at?: string;
  reject_reason?: string;
};
