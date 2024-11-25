import { Route, Routes, Navigate } from "react-router-dom";

import { UserDetail, UsersLayout } from "./Users";
import { ComingSoon } from "@components/Fallbacks";
import { User } from "@navigation/tabs";
import { ContentLayout } from "@pages/_layout";

export function MembersContainer() {
  return (
    <Routes>
      <Route path="/" element={<ContentLayout selectedTab={User} />}>
        <Route index element={<Navigate to="users" />} />
        <Route path="users" element={<UsersLayout />}>
          <Route path=":userId" element={<UserDetail />} />
        </Route>
        <Route path="people" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}
