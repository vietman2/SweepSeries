import { createContext, useContext, useMemo, useState } from "react";

import { AcademySimpleType } from "@models/products";

interface HomeContextType {
  academy: AcademySimpleType | null;
  selectAcademy: (academy: AcademySimpleType) => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [academy, setAcademy] = useState<AcademySimpleType | null>(null);

  const selectAcademy = (academy: AcademySimpleType) => {
    setAcademy(academy);
  };

  const value = useMemo(() => ({ academy, selectAcademy }), [academy]);

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};

export const useHome = () => {
  const context = useContext(HomeContext);

  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }

  return context;
};
