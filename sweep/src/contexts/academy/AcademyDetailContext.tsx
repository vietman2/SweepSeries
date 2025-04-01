import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams, usePathname } from "expo-router";

import {
  AcademyDetailType,
  CoachSimpleType,
  NoticeSimpleType,
  ProgramSimpleType,
  ReviewSummaryType,
  ReviewResponseType,
  ReviewType,
} from "@models/products";
import { alert } from "@services/alert";
import {
  getAcademyDetail,
  getCoaches,
  getPrograms,
  getNotices,
  getAcademyReviews,
  getAcademyReviewSummary,
} from "@services/products";

interface AcademyDetailContextType {
  academy: AcademyDetailType | null;
  programs: ProgramSimpleType[];
  coaches: CoachSimpleType[];
  notices: NoticeSimpleType[];
  summary: ReviewSummaryType | undefined;
  reviews: ReviewType[];
  result: ReviewResponseType | undefined;
  showDetailPage: boolean;
  loading: boolean;
  selectCoach: (coach: CoachSimpleType) => void;
  selectNotice: (id: string, notice: NoticeSimpleType) => void;
  refresh: () => void;
}

const AcademyDetailContext = createContext<
  AcademyDetailContextType | undefined
>(undefined);

export const AcademyDetailProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [academy, setAcademy] = useState<AcademyDetailType | null>(null);
  const [programs, setPrograms] = useState<ProgramSimpleType[]>([]);
  const [coaches, setCoaches] = useState<CoachSimpleType[]>([]);
  const [notices, setNotices] = useState<NoticeSimpleType[]>([]);

  const [result, setResult] = useState<ReviewResponseType>();
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [summary, setSummary] = useState<ReviewSummaryType>();

  const [showDetailPage, setShowDetailPage] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { id } = useLocalSearchParams<{ id: string }>();
  const pathname = usePathname();

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

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
      const response1 = await getAcademyDetail(id);
      const response2 = await getCoaches(id);
      const response3 = await getPrograms(id);
      const response4 = await getNotices(id);
      const response5 = await getAcademyReviewSummary(id);
      const response6 = await getAcademyReviews(id);

      if (response1 && response2 && response3 && response4 && response5 && response6) {
        setAcademy(response1);
        setCoaches(response2);
        setPrograms(response3);
        setNotices(response4);
        setSummary(response5);
        setReviews(response6.results);
        setResult(response6);
      } else {
        const handleError = () => {
          if (refreshCount === 0) {
            router.back();
          }
        };

        alert(
          "오류 발생",
          "데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          handleError
        );
      }
    };


    fetchData();
  }, [id, refreshCount]);

  useEffect(() => {
    if (pathname.split("/").length < 6) {
      setShowDetailPage(false);
    }
  }, [pathname]);

  const value = useMemo(
    () => ({
      academy,
      programs,
      coaches,
      notices,
      summary,
      reviews,
      result,
      showDetailPage,
      loading,
      selectCoach,
      selectNotice,
      refresh: handleRefresh,
    }),
    [
      academy,
      programs,
      coaches,
      notices,
      summary,
      reviews,
      result,
      showDetailPage,
      loading,
    ]
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
