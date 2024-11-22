import { Route, Routes, Navigate } from "react-router-dom";

import { ComingSoon } from "@components/Fallbacks";
import { Community } from "@navigation/tabs";
import { ContentLayout } from "@pages/_layout";

export function CommunityContainer() {
  return (
    <Routes>
      <Route path="/" element={<ContentLayout selectedTab={Community} />}>
        <Route index element={<Navigate to="reports" />} />
        <Route path="reports" element={<ComingSoon />} />
        <Route path="tags" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}
