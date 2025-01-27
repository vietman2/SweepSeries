import { router, useLocalSearchParams } from "expo-router";

import { Checkbox } from "@components/Checkbox";
import { Divider } from "@components/Dividers";
import { useSignup } from "@contexts/signup";
import { SignUpForm } from "@fragments/SignUp";

export function Terms() {
  const { terms, checkedTerms, setCheck, checkAll } = useSignup();
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

  return (
    <SignUpForm
      title="Catch B 약관에 동의해주세요!"
      subtitle="캐치비 이용을 위해 필수 약관 동의가 필요합니다."
      buttonText="다음으로"
      buttonOnPress={handleButtonPress}
      buttonDisabled={!isButtonActive}
      loading={terms.length === 0}
    >
      <Divider />
      <Checkbox
        text="모두 동의 합니다."
        checked={allChecked}
        onChange={checkAll}
      />
      <Divider />
      {terms.map((agreement) => (
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
