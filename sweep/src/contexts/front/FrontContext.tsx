import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { AcademySimpleType, CoachSimpleType } from "@models/products";
import { getMyAcademies, getMyCoachProfile } from "@services/products";

interface FrontContextType {
  mode: "academy" | "coach" | null;
  uuid: string;
  academies: AcademySimpleType[];
  coach: CoachSimpleType | undefined;
  headerImage: string;
  headerText: string;
  selectAcademy: (academy: AcademySimpleType) => void;
  selectCoach: (coach: CoachSimpleType) => void;
  refresh: () => void;
}

const FrontContext = createContext<FrontContextType | undefined>(undefined);

export const FrontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [academies, setAcademies] = useState<AcademySimpleType[]>([]);
  const [coach, setCoach] = useState<CoachSimpleType>();
  const [mode, setMode] = useState<"academy" | "coach" | null>(null);
  const [uuid, setUuid] = useState<string>("");
  const [headerImage, setHeaderImage] = useState<string>("");
  const [headerText, setHeaderText] = useState<string>("");
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const selectAcademy = (academy: AcademySimpleType) => {
    setUuid(academy.uuid);
    setMode("academy");
    setHeaderImage(academy.logo);
    setHeaderText(academy.name);
  };

  const selectCoach = (coach: CoachSimpleType) => {
    setUuid(coach.uuid);
    setMode("coach");
    setHeaderImage(coach.profile_image);
    setHeaderText(`${coach.name} 코치`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response1 = await getMyAcademies();
      const response2 = await getMyCoachProfile();

      if (response2) {
        setCoach(response2);
        setUuid(response2.uuid);
        setMode("coach");
        setHeaderImage(response2.profile_image);
        setHeaderText(`${response2.name} 코치`);
      }

      if (response1) {
        setAcademies(response1);
        setUuid(response1[0].uuid);
        setMode("academy");
        setHeaderImage(response1[0].logo);
        setHeaderText(response1[0].name);
      }
    };

    fetchData();
  }, [refreshCount]);

  const value = useMemo(
    () => ({
      mode,
      uuid,
      academies,
      coach,
      headerImage,
      headerText,
      selectAcademy,
      selectCoach,
      refresh: handleRefresh,
    }),
    [mode, uuid, academies, coach, headerImage, headerText]
  );

  return (
    <FrontContext.Provider value={value}>{children}</FrontContext.Provider>
  );
};

export const useFront = () => {
  const context = useContext(FrontContext);

  if (!context) {
    throw new Error("useFront must be used within a FrontProvider");
  }

  return context;
};
