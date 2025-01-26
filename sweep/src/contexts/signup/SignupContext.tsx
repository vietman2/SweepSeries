import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { AgreementSimpleType } from "@models/auth";
import { getAgreements } from "@services/auth";

interface SignupContextType {
  terms: AgreementSimpleType[];
  checkedTerms: CheckType[];
  setCheck: (id: number) => void;
  checkAll: () => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

type CheckType = {
  id: number;
  checked: boolean;
  required: boolean;
};

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [agreements, setAgreements] = useState<AgreementSimpleType[]>([]);
  const [checkedTerms, setCheckedTerms] = useState<CheckType[]>([]);

  const setCheck = (id: number) => {
    setCheckedTerms(
      checkedTerms.map((check) =>
        check.id === id ? { ...check, checked: !check.checked } : check
      )
    );
  };

  const checkAll = () => {
    const allChecked = checkedTerms.every((check) => check.checked);

    if (allChecked) {
      setCheckedTerms(
        checkedTerms.map((check) => ({ ...check, checked: false }))
      );
    } else {
      setCheckedTerms(
        checkedTerms.map((check) => ({ ...check, checked: true }))
      );
    }
  };

  useEffect(() => {
    const fetchAgreements = async () => {
      const response = await getAgreements();

      if (response) {
        setAgreements(response);
      }
    };

    fetchAgreements();
  }, []);

  useEffect(() => {
    setCheckedTerms(
      agreements.map((agreement) => ({
        id: agreement.id,
        checked: false,
        required: agreement.required,
      }))
    );
  }, [agreements]);

  const value = useMemo(
    () => ({
      terms: agreements,
      checkedTerms,
      setCheck,
      checkAll,
    }),
    [checkedTerms]
  );

  return (
    <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
  );
};

export const useSignup = (): SignupContextType => {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider");
  }

  return context;
};
