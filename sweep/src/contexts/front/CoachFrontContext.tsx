import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useFront } from "./FrontContext";
import { LessonType } from "@models/calendar";
import { CoachDetailType, ReviewResponseType } from "@models/products";
import { alert } from "@services/alert";
import { getDailyLessons } from "@services/calendar";
import { getCoachDetails, getCoachReviews } from "@services/products";

interface CoachFrontContextType {
  coach: CoachDetailType | undefined;
  reviews: ReviewResponseType | undefined;
  lessons: LessonType[];
  loading: boolean;
  refresh: () => void;
}

const CoachFrontContext = createContext<CoachFrontContextType | undefined>(
  undefined
);

export const CoachFrontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [coach, setCoach] = useState<CoachDetailType>();
  const [reviews, setReviews] = useState<ReviewResponseType>();
  const [lessons, setLessons] = useState<LessonType[]>([]);

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
    const fetchData = async () => {
      if (activeProfile.uuid === "" || activeProfile.mode === "academy") return;

      setLoading(true);

      const response1 = await getCoachDetails(activeProfile.uuid);
      const response2 = await getCoachReviews(activeProfile.uuid);
      const response3 = await getDailyLessons(
        activeProfile.uuid,
        new Date().toISOString().slice(0, 10),
        "coach"
      );

      if (response1 && response2 && response3) {
        setCoach(response1);
        setReviews(response2);
        setLessons(response3);
      } else {
        alert(
          "오류 발생",
          "데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    };

    fetchData();
  }, [activeProfile, refreshCount]);

  const value = useMemo(
    () => ({
      coach,
      reviews,
      lessons,
      loading,
      refresh: handleRefresh,
    }),
    [coach, reviews, lessons, loading]
  );

  return (
    <CoachFrontContext.Provider value={value}>
      {children}
    </CoachFrontContext.Provider>
  );
};

export const useCoachFront = () => {
  const context = useContext(CoachFrontContext);
  if (!context) {
    throw new Error("useCoachFront must be used within a CoachFrontProvider");
  }
  return context;
};
