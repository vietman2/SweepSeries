import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { Checkbox } from "@components/Checkbox";
import { Divider } from "@components/Dividers";
import { useSignup } from "@contexts/signup";
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
  const [checkedTerms, setCheckedTerms] = useState<CheckType[]>([]);
  const [notificationsTermId, setNotificationsTermId] = useState<number>(-1);

  const { setNotificationsAgreed } = useSignup();
  const { mode } = useLocalSearchParams<{ mode: string }>();

  const allChecked = checkedTerms.every((check) => check.checked);
  const isButtonActive = checkedTerms.every(
    (check) => !check.required || check.checked
  );

  const handleButtonPress = () => {
    if (mode === "catchb") {
      router.push("/signup/username");
    } else {
      // TODO: 네이버, 카카오 회원가입
    }
  };

  const handleTermPress = (id: number) => {
    router.push(`/signup/terms/${id}`);
  };

  const isChecked = (id: number) => {
    const check = checkedTerms.find((check) => check.id === id);

    return check ? check.checked : false;
  };

  const setCheck = (id: number) => {
    setCheckedTerms(
      checkedTerms.map((check) =>
        check.id === id ? { ...check, checked: !check.checked } : check
      )
    );

    if (id === notificationsTermId) {
      setNotificationsAgreed(!isChecked(id));
    }
  };

  const checkAll = () => {
    const allChecked = checkedTerms.every((check) => check.checked);

    if (allChecked) {
      setCheckedTerms(
        checkedTerms.map((term) => ({ ...term, checked: false }))
      );
      setNotificationsAgreed(false);
    } else {
      setCheckedTerms(checkedTerms.map((term) => ({ ...term, checked: true })));
      setNotificationsAgreed(true);
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

    const notificationsTerm = agreements.find(
      (agreement) => agreement.title.includes("알림 수신 동의")
    );
    setNotificationsTermId(notificationsTerm?.id ?? -1);
  }, [agreements]);

  return (
    <SignUpForm
      title="Catch B 약관에 동의해주세요!"
      subtitle="캐치비 이용을 위해 필수 약관 동의가 필요합니다."
      buttonText="다음으로"
      buttonOnPress={handleButtonPress}
      buttonDisabled={!isButtonActive}
      loading={agreements.length === 0}
    >
      <Divider />
      <Checkbox
        text="모두 동의 합니다."
        checked={allChecked}
        onChange={checkAll}
      />
      <Divider />
      {agreements.map((agreement) => (
        <Checkbox
          key={agreement.id}
          text={`(${agreement.required ? "필수" : "선택"}) ${agreement.title}`}
          checked={isChecked(agreement.id)}
          onChange={() => setCheck(agreement.id)}
          rightPress={
            agreement.has_content
              ? () => handleTermPress(agreement.id)
              : undefined
          }
        />
      ))}
    </SignUpForm>
  );
}
