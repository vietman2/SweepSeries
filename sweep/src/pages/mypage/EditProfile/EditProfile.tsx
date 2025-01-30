import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { launchImageLibraryAsync } from "expo-image-picker";

import { TextButton } from "@components/Buttons";
import { LoadingComponent } from "@components/Fallbacks";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { ProfileImage } from "@fragments/Profile";
import { UserType } from "@models/auth";
import { alert } from "@services/alert";
import { me, updateProfile, uploadProfileImage } from "@services/auth";
import { ThemeColorType } from "@themes/colors";
import { formatBirthDate } from "@utils/formatters";

export function EditProfile() {
  const [profile, setProfile] = useState<UserType>();
  const [nickname, setNickname] = useState<string>("");
  const [birth, setBirth] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");

  const { selectedProfile } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const formatBirth = (input: string) => {
    const formattedBirthdate = formatBirthDate(input);
    setBirth(formattedBirthdate);
  };

  const uploadImage = async () => {
    const result = await launchImageLibraryAsync({
      allowsMultipleSelection: false,
    });

    if (result.canceled) return;

    const image = result;

    const response = await uploadProfileImage(
      selectedProfile?.id,
      image.assets[0]
    );

    if (response) {
      // TODO: FINISH THIS
      console.log("Profile image uploaded successfully");
    }
  };

  const onProfileEditPress = async () => {
    const response = await updateProfile(
      selectedProfile?.id,
      nickname,
      birth,
      introduction
    );

    if (response) {
      alert("프로필 변경", "프로필이 성공적으로 변경되었습니다.");
      router.back();
    } else {
      alert(
        "오류 발생",
        "프로필 변경 중에 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await me(selectedProfile?.id || null);

      if (response) {
        setProfile(response);
        setNickname(response.selected_profile.nickname || "");
        setBirth(response.person.birth_date || "");
        setIntroduction(response.selected_profile.introduction || "");
      }
    };

    fetchData();
  }, [selectedProfile]);

  if (!profile) {
    return <LoadingComponent />;
  }

  return (
    <Scroll style={styles.container} keyboardDismissMode="on-drag">
      <View style={styles.wrapper}>
        <Text style={styles.title}>프로필 사진</Text>
        <TouchableOpacity onPress={uploadImage} testID="profile-image">
          <ProfileImage
            uri={profile.selected_profile.profile_image}
            color={profile.selected_profile.color}
            edit
          />
        </TouchableOpacity>
      </View>
      <View style={styles.wrapper}>
        <View style={styles.row}>
          <Text style={styles.title}>이름</Text>
          <Text style={styles.grayText}>
            *아카데미/코치들에게만 공개됩니다.
          </Text>
        </View>
        <TextInput
          value={profile.person.name}
          editable={false}
          style={[styles.textinput, styles.disabledTextInput]}
        />
      </View>
      <View style={styles.wrapper}>
        <Text style={styles.title}>이메일</Text>
        <TextInput
          value={profile.email}
          editable={false}
          style={[styles.textinput, styles.disabledTextInput]}
        />
      </View>
      <View style={styles.wrapper}>
        <Text style={styles.title}>연락처</Text>
        <TextInput
          value={profile.person.phone_number}
          editable={false}
          style={[styles.textinput, styles.disabledTextInput]}
        />
      </View>
      <View style={styles.wrapper}>
        <Text style={styles.title}>닉네임</Text>
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          placeholder="닉네임을 입력해주세요."
          style={styles.textinput}
          testID="nickname"
        />
      </View>
      <View style={styles.wrapper}>
        <Text style={styles.title}>생년월일</Text>
        <TextInput
          value={birth}
          onChangeText={formatBirth}
          placeholder="생년월일을 입력해주세요. (YYYY-MM-DD)"
          style={styles.textinput}
          testID="birth"
        />
      </View>
      <View style={styles.wrapper}>
        <Text style={styles.title}>자기소개</Text>
        <TextInput
          value={introduction}
          onChangeText={setIntroduction}
          placeholder="자기소개를 입력해주세요."
          style={[styles.textinput, { height: 240 }]}
          multiline
          testID="introduction"
        />
      </View>
      <TextButton
        text="변경하기"
        backgroundColor={theme.primary}
        onPress={onProfileEditPress}
        fontSize={18}
      />
    </Scroll>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    wrapper: {
      marginVertical: 8,
      gap: 8,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    grayText: {
      color: theme.lowEmphasis,
      fontSize: 14,
    },
    textinput: {
      height: 40,
      paddingHorizontal: 12,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 4,
    },
    disabledTextInput: {
      color: theme.lowEmphasis,
      backgroundColor: theme.backgroundGray,
    },
    void: {
      height: 40,
    },
  });
