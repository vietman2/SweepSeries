import { AcademyProfileManagement } from "./AcademyProfile/AcademyProfile";
import { CoachProfileManagement } from "./CoachProfile/CoachProfile";
import { useFront } from "@contexts/front";

export function ProfileManagement() {
  const { mode } = useFront();

  if (mode === null) return null;

  if (mode === "academy") {
    return <AcademyProfileManagement />;
  }

  return <CoachProfileManagement />;
}
