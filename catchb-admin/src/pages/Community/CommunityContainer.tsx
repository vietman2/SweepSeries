import { Route, Routes, Navigate } from "react-router-dom";

import {
  ReportsLayout,
  CommentReportLayout,
  ReCommentReportLayout,
  PostReportsLayout,
  PostReportDetail,
  CommentReportDetail,
  ReCommentReportDetail,
} from "./Reports";
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
          <Route path="comments" element={<CommentReportLayout />}>
            <Route path=":reportId" element={<CommentReportDetail />} />
          </Route>
          <Route path="recomments" element={<ReCommentReportLayout />}>
            <Route path=":reportId" element={<ReCommentReportDetail />} />
          </Route>
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
