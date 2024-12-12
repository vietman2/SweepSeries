import { Route, Routes, Navigate } from "react-router-dom";

import { CoachList } from "./Coaches";
import { Coaches } from "@navigation/tabs";
import { ContentLayout } from "@pages/_layout";

export function CoachContainer() {
  return (
    <Routes>
      <Route path="/" element={<ContentLayout selectedTab={Coaches} />}>
        <Route index element={<Navigate to="coaches" />} />
        <Route path="coaches" element={<CoachList />} />
      </Route>
    </Routes>
  );
}
