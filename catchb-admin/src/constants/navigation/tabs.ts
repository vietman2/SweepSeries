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
      title: "공지 관리",
      path: "/apps/notices",
    },
    {
      title: "FAQ 관리",
      path: "/apps/faqs",
    },
    {
      title: "약관 관리",
      path: "/apps/terms",
    },
  ],
};

export const Academies: TabType = {
  title: "아카데미 관리",
  path: "/academies",
  pathName: "academies",
  subtabs: [
    {
      title: "아카데미 등록",
      path: "/academies/academies",
    },
  ],
};

export const Coaches: TabType = {
  title: "코치 관리",
  path: "/coaches",
  pathName: "coaches",
  subtabs: [
    {
      title: "코치 등록",
      path: "/coaches/coaches",
    },
  ],
};

export const tabs: TabType[] = [Home, User, Community, Apps, Academies, Coaches];
