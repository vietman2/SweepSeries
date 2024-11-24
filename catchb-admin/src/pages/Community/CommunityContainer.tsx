import { Route, Routes, Navigate } from "react-router-dom";

import { TagDetail, TagsLayout, TagWrite } from "./Tags";
import { ComingSoon } from "@components/Fallbacks";
import { Community } from "@navigation/tabs";
import { ContentLayout } from "@pages/_layout";

export function CommunityContainer() {
  return (
    <Routes>
      <Route path="/" element={<ContentLayout selectedTab={Community} />}>
        <Route index element={<Navigate to="reports" />} />
        <Route path="reports" element={<ComingSoon />} />
        <Route path="tags" element={<TagsLayout />}>
          <Route path="create" element={<TagWrite />} />
          <Route path=":tagId" element={<TagDetail />} />
          <Route path=":tagId/edit" element={<TagWrite />} />
        </Route>
      </Route>
    </Routes>
  );
}
