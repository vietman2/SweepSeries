import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { TextInput } from "@components/Inputs";
import { Text } from "@components/Texts";
import { useSignup } from "@contexts/signup";
import { useTheme } from "@contexts/theme";
import { SignUpForm } from "@fragments/SignUp";
import { alert } from "@services/alert";
import { register } from "@services/auth";
import { ThemeColorType } from "@themes/colors";
import { formatBirthDate } from "@utils/formatters";

const genderChoices = ["남성", "여성", "기타"];

export function Extras() {
  const [nickname, setNickname] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [gender, setGender] = useState<string>("남성");

  const { mode, user, notificationsAgreed } = useSignup();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleBirthdateChange = (input: string) => {
    const formatted = formatBirthDate(input);

    setBirthdate(formatted);
  };

  const handleGenderSelect = (selected: string) => {
    setGender(selected);
  };

  const handleSignup = async () => {
    const response = await register(
      mode,
      user,
      { nickname, birthdate, gender, profileImage: "" },
      notificationsAgreed
    );

    if (response) {
      alert("회원가입이 완료", "회원가입이 완료되었습니다. 로그인해주세요.");
      router.dismissAll();
      router.replace("/login");
    } else {
      alert("회원가입 실패", "회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <SignUpForm
      title="프로필을 완성해주세요!"
      buttonText="회원가입"
      buttonOnPress={handleSignup}
      buttonDisabled={false}
    >
      <View style={styles.container}>
        <View>
          <Text style={styles.subtitle}>닉네임</Text>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해주세요."
            returnKeyType="next"
          />
        </View>
        <View>
          <Text style={styles.subtitle}>
            생년월일 <Text style={styles.graySubtitle}>(선택)</Text>
          </Text>
          <TextInput
            value={birthdate}
            onChangeText={handleBirthdateChange}
            placeholder="생년월일을 입력해주세요. (YYYYMMDD)"
            returnKeyType="next"
            type="number-pad"
          />
        </View>
        <View>
          <Text style={styles.subtitle}>성별</Text>
          <View style={styles.options}>
            {genderChoices.map((choice) => (
              <TouchableOpacity
                key={choice}
                onPress={() => handleGenderSelect(choice)}
                style={[
                  styles.option,
                  gender === choice && styles.selectedOption,
                ]}
                testID={choice}
              >
                <Text
                  style={[
                    styles.optionText,
                    gender === choice && styles.selectedOptionText,
                  ]}
                >
                  {choice}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SignUpForm>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      marginTop: 16,
      gap: 16,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    graySubtitle: {
      fontSize: 14,
      fontWeight: "normal",
      color: theme.lowEmphasis,
    },
    options: {
      flexDirection: "row",
      marginVertical: 8,
      gap: 8,
    },
    option: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    selectedOption: {
      backgroundColor: theme.primary,
      borderColor: "transparent",
    },
    optionText: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    selectedOptionText: {
      color: theme.background,
    },
  });
