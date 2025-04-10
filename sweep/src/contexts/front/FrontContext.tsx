import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { router } from "expo-router";

import { AcademyProfileType, CoachProfileType } from "@models/products";
import { getPromodeProfiles } from "@services/products";
import { getStorage, saveStorage } from "@services/storage";

type ProfileType = {
  uuid: string;
  name: string;
  image: string;
};

interface FrontContextType {
  academies: AcademyProfileType[];
  coaches: CoachProfileType[];
  activeProfile: ProfileType;
  isReady: boolean;
  selectAcademy: (academy: AcademyProfileType) => Promise<void>;
  selectCoach: (coach: CoachProfileType) => Promise<void>;
  refreshProfile: () => void;
}

const FrontContext = createContext<FrontContextType | undefined>(undefined);

export const FrontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [academies, setAcademies] = useState<AcademyProfileType[]>([]);
  const [coaches, setCoaches] = useState<CoachProfileType[]>([]);
  const [activeProfile, setActiveProfile] = useState<ProfileType>({
    uuid: "",
    name: "",
    image: "",
  });

  const [isReady, setIsReady] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const refresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const selectAcademy = async (academy: AcademyProfileType) => {
    setActiveProfile({
      uuid: academy.uuid,
      name: academy.name,
      image: academy.logo,
    });

    await saveStorage("front_uuid", academy.uuid);

    router.replace({
      pathname: "/front/academy/[id]/profile",
      params: { id: academy.uuid },
    });
  };

  const selectCoach = async (coach: CoachProfileType) => {
    setActiveProfile({
      uuid: coach.uuid,
      name: `${coach.name} 코치 (${coach.academy.name})`,
      image: coach.profile_image,
    });

    await saveStorage("front_uuid", coach.uuid);

    router.replace({
      pathname: "/front/coach/[id]",
      params: { id: coach.uuid },
    });
  };

  // 서버에서 데이터 불러오기 (새로고침 시 다시 불러옴)
  useEffect(() => {
    const fetchServerData = async () => {
      const response = await getPromodeProfiles();

      if (response) {
        setAcademies(response.academies);
        setCoaches(response.coach);
      }

      setIsReady(true);
    };

    fetchServerData();
  }, [refreshCount]);

  useEffect(() => {
    const selectProfile = async () => {
      const savedUUID = await getStorage("front_uuid");

      if (savedUUID) {
        const academy = academies.find((academy) => academy.uuid === savedUUID);
        const coach = coaches.find((coach) => coach.uuid === savedUUID);

        if (academy) {
          setActiveProfile({
            uuid: academy.uuid,
            name: academy.name,
            image: academy.logo,
          });
          router.replace({
            pathname: "/front/academy/[id]/profile",
            params: { id: academy.uuid },
          });
          return;
        }
        if (coach) {
          setActiveProfile({
            uuid: coach.uuid,
            name: `${coach.name} 코치 (${coach.academy.name})`,
            image: coach.profile_image,
          });
          router.replace({
            pathname: "/front/coach/[id]",
            params: { id: coach.uuid },
          });
          return;
        }
      }

      if (academies.length > 0) {
        selectAcademy(academies[0]);
      } else if (coaches.length > 0) {
        selectCoach(coaches[0]);
      }
    };

    selectProfile();
  }, [academies, coaches]);

  const value = useMemo(
    () => ({
      academies,
      coaches,
      activeProfile,
      isReady,
      selectAcademy,
      selectCoach,
      refreshProfile: refresh,
    }),
    [academies, coaches, activeProfile, isReady]
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
