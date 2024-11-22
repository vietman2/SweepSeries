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
  path: "/users",
  pathName: "users",
  subtabs: [],
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

export const tabs: TabType[] = [Home, User, Community];
