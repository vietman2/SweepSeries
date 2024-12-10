import { Route, Routes, Navigate } from "react-router-dom";

import { AcademyList } from "./Academies";
import { Academies } from "@navigation/tabs";
import { ContentLayout } from "@pages/_layout";

export function AcademyContainer() {
  return (
    <Routes>
      <Route path="/" element={<ContentLayout selectedTab={Academies} />}>
        <Route index element={<Navigate to="academies" />} />
        <Route path="academies" element={<AcademyList />} />
      </Route>
    </Routes>
  );
}
