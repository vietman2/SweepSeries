import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useFront } from "./FrontContext";
import { LessonType } from "@models/calendar";
import {
  AcademyDetailType,
  CoachSimpleType,
  FacilityType,
  NoticeSimpleType,
  ProgramSimpleType,
  ReviewResponseType,
} from "@models/products";
import { alert } from "@services/alert";
import { getDailyLessons } from "@services/calendar";
import {
  getAcademyDetail,
  getEmployedCoaches,
  getFacilityOptions,
  getNotices,
  getPrograms,
  getAcademyReviews,
} from "@services/products";

interface AcademyFrontContextType {
  academy: AcademyDetailType | null;
  programs: ProgramSimpleType[];
  notices: NoticeSimpleType[];
  coaches: CoachSimpleType[];
  requests: CoachSimpleType[];
  reviews: ReviewResponseType | undefined;
  lessons: LessonType[];
  facilityOptions: FacilityType[];
  loading: boolean;
  refresh: () => void;
}

const AcademyFrontContext = createContext<AcademyFrontContextType | undefined>(
  undefined
);

export const AcademyFrontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 아카데미 상세 정보
  const [academy, setAcademy] = useState<AcademyDetailType | null>(null);
  const [programs, setPrograms] = useState<ProgramSimpleType[]>([]);
  const [notices, setNotices] = useState<NoticeSimpleType[]>([]);
  const [coaches, setCoaches] = useState<CoachSimpleType[]>([]);
  const [requests, setRequests] = useState<CoachSimpleType[]>([]);
  const [reviews, setReviews] = useState<ReviewResponseType>();
  const [lessons, setLesson] = useState<LessonType[]>([]);

  // 정보 수정용 옵션들
  const [facilityOptions, setFacilityOptions] = useState<FacilityType[]>([]);

  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { activeProfile } = useFront();

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // 새로고침 할 때마다 다시 불러올 데이터
    const fetchData = async () => {
      if (activeProfile.uuid === "" || activeProfile.mode === "coach") return;

      setLoading(true);

      const response1 = await getAcademyDetail(activeProfile.uuid);
      const response2 = await getPrograms(activeProfile.uuid);
      const response3 = await getNotices(activeProfile.uuid);
      const response4 = await getEmployedCoaches(activeProfile.uuid);
      const response5 = await getAcademyReviews(activeProfile.uuid);
      const response6 = await getDailyLessons(
        activeProfile.uuid,
        new Date().toISOString().slice(0, 10),
        "academy"
      );

      if (
        response1 &&
        response2 &&
        response3 &&
        response4 &&
        response5 &&
        response6
      ) {
        setAcademy(response1);
        setPrograms(response2);
        setNotices(response3);
        setCoaches(response4.accepted);
        setRequests(response4.pending);
        setReviews(response5);
        setLesson(response6);
      } else {
        alert(
          "오류 발생",
          "데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    };

    fetchData();
  }, [activeProfile, refreshCount]);

  useEffect(() => {
    // 초기 렌더링 시 한 번만 불러올 데이터
    const fetchInitialData = async () => {
      const options = await getFacilityOptions();

      if (options) {
        setFacilityOptions(options);
      }
    };

    fetchInitialData();
  }, []);

  const value = useMemo(
    () => ({
      academy,
      programs,
      notices,
      coaches,
      requests,
      reviews,
      lessons,
      facilityOptions,
      loading,
      refresh: handleRefresh,
    }),
    [
      academy,
      programs,
      notices,
      coaches,
      requests,
      reviews,
      lessons,
      facilityOptions,
      loading,
    ]
  );

  return (
    <AcademyFrontContext.Provider value={value}>
      {children}
    </AcademyFrontContext.Provider>
  );
};

export const useAcademyFront = () => {
  const context = useContext(AcademyFrontContext);

  if (!context) {
    throw new Error(
      "useAcademyFront must be used within a AcademyFrontProvider"
    );
  }

  return context;
};
