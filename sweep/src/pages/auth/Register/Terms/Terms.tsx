import { useEffect, useState } from "react";
import { router } from "expo-router";

import { Checkbox } from "@components/Checkbox";
import { Divider } from "@components/Dividers";
import { SignUpForm } from "@fragments/SignUp";
import { AgreementSimpleType } from "@models/auth";
import { getAgreements } from "@services/auth";

type CheckType = {
  id: number;
  checked: boolean;
  required: boolean;
};

export function Terms() {
  const [agreements, setAgreements] = useState<AgreementSimpleType[]>([]);
  const [checkList, setCheckList] = useState<CheckType[]>([]);

  const allChecked = checkList.every((check) => check.checked);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const toggleCheckAll = () => {
    if (allChecked) {
      setCheckList(checkList.map((check) => ({ ...check, checked: false })));
    } else {
      setCheckList(checkList.map((check) => ({ ...check, checked: true })));
    }
  };

  const isButtonActive = checkList.every(
    (check) => !check.required || check.checked
  );

  const handleButtonPress = () => {
    router.push("/signup/2");
  };

  const isChecked = (id: number) => {
    const check = checkList.find((check) => check.id === id);

    return check ? check.checked : false;
  };

  const setCheck = (id: number) => {
    setCheckList(
      checkList.map((check) =>
        check.id === id ? { ...check, checked: !check.checked } : check
      )
    );
  };

  useEffect(() => {
    const fetchAgreements = async () => {
      setLoading(true);

      const response = await getAgreements();

      if (response) {
        setAgreements(response);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    fetchAgreements();
  }, []);

  useEffect(() => {
    setCheckList(
      agreements.map((agreement) => ({
        id: agreement.id,
        checked: false,
        required: agreement.required,
      }))
    );
  }, [agreements]);

  return (
    <SignUpForm
      title="Catch B 약관에 동의해주세요!"
      subtitle="캐치비 이용을 위해 필수 약관 동의가 필요합니다."
      buttonText="다음으로"
      buttonOnPress={handleButtonPress}
      buttonDisabled={!isButtonActive}
      loading={loading}
      error={error}
    >
      <Checkbox
        text="모두 동의 합니다."
        checked={allChecked}
        onChange={toggleCheckAll}
      />
      <Divider />
      {agreements.map((agreement) => (
        <Checkbox
          key={agreement.id}
          text={`(${agreement.required ? "필수" : "선택"}) ${agreement.title}`}
          checked={isChecked(agreement.id)}
          onChange={() => setCheck(agreement.id)}
          rightPress={agreement.has_content ? () => {} : undefined}
        />
      ))}
    </SignUpForm>
  );
}
