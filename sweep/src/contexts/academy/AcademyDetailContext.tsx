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
    const fetchAcademies = async () => {
      const response = await getAcademyDetail(id);

      if (response) {
        setAcademy(response);
      } else {
        alert(
          "오류 발생",
          "데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    };

    const fetchCoaches = async () => {
      const response = await getCoaches(id);

      if (response) {
        setCoaches(response);
      } else {
        alert(
          "오류 발생",
          "데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    };

    const fetchPrograms = async () => {
      const response = await getPrograms(id);

      if (response) {
        setPrograms(response);
      } else {
        alert(
          "오류 발생",
          "데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    };

    const fetchNotices = async () => {
      const response = await getNotices(id);

      if (response) {
        setNotices(response);
      } else {
        alert(
          "오류 발생",
          "데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    };

    const fetchReviews = async () => {
      const response1 = await getAcademyReviewSummary(id);
      const response2 = await getAcademyReviews(id);

      if (response1 && response2) {
        setSummary(response1);
        setReviews(response2.results);
        setResult(response2);
      } else {
        alert(
          "오류 발생",
          "데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    };

    fetchAcademies();
    fetchCoaches();
    fetchPrograms();
    fetchNotices();
    fetchReviews();
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
