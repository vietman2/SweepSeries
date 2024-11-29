import { Route, Routes, Navigate } from "react-router-dom";

import { ReportsLayout, PostReportsLayout, PostReportDetail } from "./Reports";
import { TagDetail, TagsLayout, TagWrite } from "./Tags";
import { Community } from "@navigation/tabs";
import { ContentLayout } from "@pages/_layout";

export function CommunityContainer() {
  return (
    <Routes>
      <Route path="/" element={<ContentLayout selectedTab={Community} />}>
        <Route index element={<Navigate to="reports" />} />
        <Route path="reports" element={<ReportsLayout />}>
          <Route index element={<Navigate to="posts" />} />
          <Route path="posts" element={<PostReportsLayout />}>
            <Route path=":reportId" element={<PostReportDetail />} />
          </Route>
          <Route path="comments" element={<div />} />
          <Route path="recomments" element={<div />} />
        </Route>
        <Route path="tags" element={<TagsLayout />}>
          <Route path="create" element={<TagWrite />} />
          <Route path=":tagId" element={<TagDetail />} />
          <Route path=":tagId/edit" element={<TagWrite />} />
        </Route>
      </Route>
    </Routes>
  );
}
