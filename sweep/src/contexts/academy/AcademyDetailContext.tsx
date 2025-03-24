import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams, usePathname } from "expo-router";

import {
  AcademyDetailType,
  CoachSimpleType,
  NoticeSimpleType,
} from "@models/products";
import { getAcademyDetail } from "@services/products";

interface AcademyDetailContextType {
  academy: AcademyDetailType | null;
  showDetailPage: boolean;
  selectCoach: (coach: CoachSimpleType) => void;
  selectNotice: (id: string, notice: NoticeSimpleType) => void;
}

const AcademyDetailContext = createContext<
  AcademyDetailContextType | undefined
>(undefined);

export const AcademyDetailProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [academy, setAcademy] = useState<AcademyDetailType | null>(null);
  const [showDetailPage, setShowDetailPage] = useState<boolean>(false);

  const { id } = useLocalSearchParams<{ id: string }>();
  const pathname = usePathname();

  const selectCoach = (coach: CoachSimpleType) => {
    router.push({
      pathname: "/(tabs)/home/academy/[id]/coaches/[coachid]",
      params: { id: coach.academy_uuid, coachid: coach.uuid },
    });

    setShowDetailPage(true);
  };

  const selectNotice = (id: string, notice: NoticeSimpleType) => {
    router.push({
      pathname: "/home/academy/[id]/notices/[noticeid]",
      params: { id: id, noticeid: notice.id },
    });

    setShowDetailPage(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAcademyDetail(id);

      if (response) {
        setAcademy(response);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (pathname.split("/").length < 6) {
      setShowDetailPage(false);
    }
  }, [pathname]);

  const value = useMemo(
    () => ({ academy, showDetailPage, selectCoach, selectNotice }),
    [academy, showDetailPage]
  );

  return (
    <AcademyDetailContext.Provider value={value}>
      {children}
    </AcademyDetailContext.Provider>
  );
};

export const useAcademyDetail = () => {
  const context = useContext(AcademyDetailContext);

  if (!context) {
    throw new Error(
      "useAcademyDetail must be used within a AcademyDetailProvider"
    );
  }

  return context;
};
