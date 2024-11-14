import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { TextButton } from "@components/Buttons";
import { Checkbox } from "@components/Checkbox";
import { Divider } from "@components/Dividers";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function Terms() {
  const [ageChecked, setAgeChecked] = useState<boolean>(false);
  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const [privacyChecked, setPrivacyChecked] = useState<boolean>(false);
  const [notificationChecked, setNotificationChecked] =
    useState<boolean>(false);

  const allChecked = ageChecked && termsChecked && privacyChecked && notificationChecked;
  const isButtonActive = ageChecked && termsChecked && privacyChecked;

  const toggleCheckAll = () => {
    if (allChecked) {
      setAgeChecked(false);
      setTermsChecked(false);
      setPrivacyChecked(false);
      setNotificationChecked(false);
    } else {
      setAgeChecked(true);
      setTermsChecked(true);
      setPrivacyChecked(true);
      setNotificationChecked(true);
    }
  }

  const handleButtonPress = () => {
    router.push("/signup/2");
  }

  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Catch B 약관에 동의해주세요!</Text>
          <Text style={styles.subtitle}>
            캐치비 이용을 위해 필수 약관 동의가 필요합니다.
          </Text>
        </View>
        <Divider />
        <Checkbox
          text="모두 동의 합니다."
          checked={allChecked}
          onChange={toggleCheckAll}
        />
        <Divider />
        <Checkbox
          text="(필수) 만 14세 이상입니다."
          checked={ageChecked}
          onChange={() => setAgeChecked(!ageChecked)}
          grayText
        />
        <Checkbox
          text="(필수) Catch B 서비스 이용약관"
          checked={termsChecked}
          onChange={() => setTermsChecked(!termsChecked)}
          rightPress={() => {}}
          grayText
        />
        <Checkbox
          text="(필수) Catch B 개인정보 처리방침"
          checked={privacyChecked}
          onChange={() => setPrivacyChecked(!privacyChecked)}
          rightPress={() => {}}
          grayText
        />
        <Checkbox
          text="(선택) 광고성/경고 알림 수신 동의"
          checked={notificationChecked}
          onChange={() => setNotificationChecked(!notificationChecked)}
          grayText
        />
      </View>
      <TextButton
        text="다음으로"
        backgroundColor={theme.primary}
        onPress={handleButtonPress}
        fontSize={18}
        active={isButtonActive}
      />
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 36,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    page: {
      flex: 1,
      paddingVertical: 16,
      gap: 16,
    },
    header: {
      gap: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    subtitle: {
      fontSize: 16,
      color: theme.lowEmphasis,
    },
  });
