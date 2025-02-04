import { AcademyFront } from "../AcademyFront/AcademyFront";
import { CoachFront } from "../CoachFront/CoachFront";
import { LoadingComponent } from "@components/Fallbacks";
import { useFront } from "@contexts/front";

export function Front() {
  const { mode } = useFront();

  if (mode === "academy") return <AcademyFront />;
  if (mode === "coach") return <CoachFront />;
  return <LoadingComponent />;
}
