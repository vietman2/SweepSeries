import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { TextButton } from "@components/Buttons";
import { TextInput } from "@components/Inputs";
import { useSignup } from "@contexts/signup";
import { useTheme } from "@contexts/theme";
import { SignUpForm } from "@fragments/SignUp";
import { alert } from "@services/alert";
import { requestCode, verifyCode } from "@services/auth";
import { ThemeColorType } from "@themes/colors";
import { formatMobileNumber } from "@utils/formatters";

export function PhoneNumber() {
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);

  const { setNamePhone, mode, user } = useSignup();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleNumberChange = (text: string) => {
    const formattedText = formatMobileNumber(text);
    setPhoneNumber(formattedText);
  };

  const handleSendRequest = async () => {
    const response = await requestCode(phoneNumber);

    if (response) {
      setSent(true);
      setTimer(180);
      setError("");
    } else {
      alert("오류 발생", "이미 가입된 전화번호입니다.");
    }
  };

  const handleVerifyCode = async () => {
    const response = await verifyCode(phoneNumber, code);

    if (response.status === 200) {
      setVerified(true);
      setError("");
      setNamePhone(name, phoneNumber);
      alert("인증 성공", "휴대폰 번호가 인증되었습니다.");
    } else {
      setError(response.data.error);
    }
  };

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    router.push("/signup/extras");
  };

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [timer]);

  useEffect(() => {
    if (mode === "naver") {
      setName(user.name);
    }
  }, [mode, user]);

  return (
    <SignUpForm
      title="전화번호를 인증해주세요!"
      subtitle={"안전하고 편리한 서비스 이용을 위해\n본인인증을 진행해주세요."}
      buttonText="다음으로"
      buttonOnPress={handleNext}
      buttonDisabled={!verified}
    >
      <View>
        <Text style={styles.subtitle}>이름</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="이름을 입력해주세요."
          returnKeyType="done"
        />
      </View>
      <View>
        <Text style={styles.subtitle}>휴대폰 번호</Text>
        <View style={styles.row}>
          <View style={styles.input}>
            <TextInput
              value={phoneNumber}
              onChangeText={handleNumberChange}
              placeholder="휴대폰 번호를 입력해주세요."
              type="phone-pad"
              returnKeyType="done"
            />
          </View>
          <TextButton
            text={
              timer > 0 ? `재발송 (${formatTimer(timer)})` : "인증번호 받기"
            }
            onPress={handleSendRequest}
            fontSize={16}
            active={phoneNumber.length === 13 && timer === 0}
          />
        </View>
      </View>
      {sent && (
        <View>
          <Text style={styles.subtitle}>인증번호</Text>
          <View style={styles.row}>
            <View style={styles.input}>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="인증번호를 입력해주세요."
                type="number-pad"
                returnKeyType="done"
              />
            </View>
            <TextButton
              text="인증하기"
              onPress={handleVerifyCode}
              fontSize={16}
              active={code.length === 6 && !verified}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      )}
    </SignUpForm>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    input: {
      flex: 1,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.mediumEmphasis,
    },
    error: {
      marginTop: 10,
      color: "rgba(255, 0, 0, 0.8)",
      fontSize: 14,
      textAlign: "left",
    },
  });
