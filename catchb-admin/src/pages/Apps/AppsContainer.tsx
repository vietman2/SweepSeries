import { Route, Routes, Navigate } from "react-router-dom";

import { TermsLayout } from "./Terms";
import { Apps } from "@navigation/tabs";
import { ContentLayout } from "@pages/_layout";

export function AppsContainer() {
  return (
    <Routes>
      <Route path="/" element={<ContentLayout selectedTab={Apps} />}>
        <Route index element={<Navigate to="terms" />} />
        <Route path="terms" element={<TermsLayout />} />
      </Route>
    </Routes>
  );
}
