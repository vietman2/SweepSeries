import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "expo-router";

import { LessonType } from "@models/calendar";
import { TagOptionsType } from "@models/products";
import { getTagOptions } from "@services/products";

interface ReviewContextType {
  sessionToReview: LessonType | null;
  tagOptions: TagOptionsType | undefined;
  setSession: (session: LessonType) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessionToReview, setSessionToReview] = useState<LessonType | null>(
    null
  );
  const [tagOptions, setTagOptions] = useState<TagOptionsType>();

  const pathname = usePathname();

  useEffect(() => {
    const fetchOptions = async () => {
      const response = await getTagOptions();

      if (response) {
        setTagOptions(response);
      }
    };

    if (!pathname.includes("reviews/new")) {
      setSessionToReview(null);
    } else {
      fetchOptions();
    }
  }, [pathname]);

  const value = useMemo(
    () => ({
      sessionToReview,
      tagOptions,
      setSession: setSessionToReview,
    }),
    [sessionToReview, tagOptions]
  );

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);

  if (!context) {
    throw new Error("useReview must be used within a ReviewProvider");
  }

  return context;
};
