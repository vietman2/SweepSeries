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
}

function AcademyCard({ mode, type = 1 }: Readonly<Props>) {
  if (mode === "pro") {
    return <ProCard />;
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
