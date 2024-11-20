export type TabType = {
  title: string;
  path: string;
  pathName: string;
};

export const tabs: TabType[] = [
  {
    title: "홈",
    path: "/home",
    pathName: "home",
  },
  {
    title: "회원 관리",
    path: "/users",
    pathName: "users",
  },
  {
    title: "커뮤니티 관리",
    path: "/community",
    pathName: "community",
  },
];
