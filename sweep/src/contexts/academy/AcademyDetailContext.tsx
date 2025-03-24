import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import { AcademyDetailType } from "@models/products";
import { getAcademyDetail } from "@services/products";

interface AcademyDetailContextType {
  academy: AcademyDetailType | null;
}

const AcademyDetailContext = createContext<
  AcademyDetailContextType | undefined
>(undefined);

export const AcademyDetailProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [academy, setAcademy] = useState<AcademyDetailType | null>(null);

  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAcademyDetail(id);

      if (response) {
        setAcademy(response);
      }
    };

    fetchData();
  }, []);

  const value = useMemo(() => ({ academy }), [academy]);

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
