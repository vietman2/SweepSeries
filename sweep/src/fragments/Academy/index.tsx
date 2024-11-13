import { NormalCard, ProCard } from "./AcademyCard/AcademyCard";
import { AcademyProfile } from "./AcademyProfile/AcademyProfile";
import { AcademySimple } from "./AcademySimple/AcademySimple";
import { AcademySuggest } from "./AcademySuggest/AcademySuggest";
import { Facilities } from "./Information/Facilities/Facilities";
import { Introduction } from "./Information/Introduction/Introduction";
import { WorkingHours } from "./Information/WorkingHours/WorkingHours";

interface Props {
  mode: "normal" | "pro";
  type?: 1 | 2;
  num_students?: number;
  num_requests?: number;
}

function AcademyCard({ mode, type = 1, num_requests = 0, num_students = 0 }: Readonly<Props>) {
  if (mode === "pro") {
    return <ProCard num_requests={num_requests} num_students={num_students} />;
  } else {
    return <NormalCard type={type} />;
  }
}

export {
  AcademyCard,
  AcademyProfile,
  AcademySimple,
  AcademySuggest,
  Facilities,
  Introduction,
  WorkingHours,
};
