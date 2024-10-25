import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { TextButton } from "@components/Buttons";
import { TextInput } from "@components/Inputs";
import { Scroll } from "@components/ScrollView";
import { useTheme } from "@contexts/theme";
import { ProfileImage } from "@fragments/Profile";
import { ThemeColorType } from "@themes/colors";
import { formatBirthDate } from "@utils/formatters";

export function EditProfile() {
  //const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [birth, setBirth] = useState<string>("");
  //const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const formatBirth = (input: string) => {
    const formattedBirthdate = formatBirthDate(input);
    setBirth(formattedBirthdate);
  };

  const onProfileEditPress = async () => {
    // TODO: integrate profile edit with the backend
  };

  return (
    <Scroll style={styles.container} keyboardDismissMode="on-drag">
      <ProfileImage edit />
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={phone} onChangeText={setPhone} />
      <TextInput
        value={nickname}
        onChangeText={setNickname}
        placeholder={"닉네임을 입력해주세요."}
      />
      <TextInput
        value={birth}
        onChangeText={formatBirth}
        placeholder="YYYY-MM-DD"
        type="number-pad"
      />
      <TextButton
        text="변경하기"
        backgroundColor={theme.primary}
        onPress={onProfileEditPress}
        fontSize={18}
      />
      <View style={styles.void} />
    </Scroll>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    textInput: {
      marginVertical: 20,
    },
    void: {
      height: 40,
    },
  });
