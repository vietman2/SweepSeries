import { AcademyDetail } from "./AcademyDetail/AcademyDetail";
import { MyAcademy } from "./MyAcademy/MyAcademy";
import { NormalHome } from "./NormalHome/NormalHome";
import { ProHome } from "./ProHome/ProHome";
import { useAuth } from "@contexts/auth";

function Home() {
  const { mode } = useAuth();

  if (mode === "pro") {
    return <ProHome />;
  } else {
    return <NormalHome />;
  }
}

export { AcademyDetail, MyAcademy, Home };
