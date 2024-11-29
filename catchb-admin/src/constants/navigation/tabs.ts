export type TabType = {
  title: string;
  path: string;
  pathName: string;
  subtabs: SubTabType[];
};

export type SubTabType = {
  title: string;
  path: string;
};

export const Home: TabType = {
  title: "홈",
  path: "/home",
  pathName: "home",
  subtabs: [
    {
      title: "대시보드",
      path: "/home",
    },
    {
      title: "할 일",
      path: "/todos",
    },
  ],
};

export const User: TabType = {
  title: "회원 관리",
  path: "/members",
  pathName: "members",
  subtabs: [
    {
      title: "유저 목록",
      path: "/members/users",
    },
    {
      title: "미가입 회원",
      path: "/members/people",
    },
  ],
};

export const Community: TabType = {
  title: "커뮤니티 관리",
  path: "/community",
  pathName: "community",
  subtabs: [
    {
      title: "신고 관리",
      path: "/community/reports",
    },
    {
      title: "태그 관리",
      path: "/community/tags",
    },
  ],
};

export const Apps: TabType = {
  title: "앱 관리",
  path: "/apps",
  pathName: "apps",
  subtabs: [
    {
      title: "약관 관리",
      path: "/apps/terms",
    },
  ],
};

export const tabs: TabType[] = [Home, User, Community, Apps];
