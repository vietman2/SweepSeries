import { Route, Routes, Navigate } from "react-router-dom";

import { FAQCreate, FAQDetail, FAQsLayout } from "./FAQs";
import { NoticeDetail, NoticesLayout, NoticeWrite } from "./Notices";
import { TermsCreate, TermsDetail, TermsLayout } from "./Terms";
import { Apps } from "@navigation/tabs";
import { ContentLayout } from "@pages/_layout";

export function AppsContainer() {
  return (
    <Routes>
      <Route path="/" element={<ContentLayout selectedTab={Apps} />}>
        <Route index element={<Navigate to="notices" />} />
        <Route path="notices" element={<NoticesLayout />}>
          <Route path="create" element={<NoticeWrite />} />
          <Route path=":noticeId" element={<NoticeDetail />} />
        </Route>
        <Route path="faqs" element={<FAQsLayout />}>
          <Route path="create" element={<FAQCreate />} />
          <Route path=":faqId" element={<FAQDetail />} />
        </Route>
        <Route path="terms" element={<TermsLayout />}>
          <Route path="create" element={<TermsCreate />} />
          <Route path=":termId" element={<TermsDetail />} />
          <Route path=":termId/edit" element={<Navigate to="terms" />} />
        </Route>
      </Route>
    </Routes>
  );
}
