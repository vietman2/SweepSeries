export type CalendarType = {
  title: string;
  color: string;
  notifications: boolean;
  notifications_today: boolean;
  daily_time: string;
  uuid: string; // 아카데미의 uuid or 유저의 uuid
  role: string; // 아카데미에서의 role: OWNER, STUDENT, COACH 중 하나
  type: string; // 아카데미인지 유저인지 구분: ACADEMY, PERSONAL 중 하나
  logo?: string; // 아카데미의 로고 이미지 URL
  num_members?: number; // 아카데미의 멤버 수
};
