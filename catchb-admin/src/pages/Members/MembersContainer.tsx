import { Route, Routes, Navigate } from "react-router-dom";

import { PeopleList } from "./People";
import { UserDetail, UsersLayout } from "./Users";
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
        <Route path="people" element={<PeopleList />} />
      </Route>
    </Routes>
  );
}
