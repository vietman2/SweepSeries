import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { SimpleModal } from "@components/Modals";
import { Scroll } from "@components/ScrollView";
import { CalloutSmall, Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CoachDetailType } from "@models/products";
import { alert } from "@services/alert";
import {
  getCoachDetails,
  updateCoachIntro,
  updateCoachSNS,
} from "@services/products";
import { ThemeColorType } from "@themes/colors";
import { ErrorPage } from "@components/Fallbacks";

interface Props {
  uuid: string;
}

export function CoachProfile({ uuid }: Readonly<Props>) {
  const [coach, setCoach] = useState<CoachDetailType>();
  const [introInput, setIntroInput] = useState<string>("");
  const [introModalVisible, setIntroModalVisible] = useState<boolean>(false);
  const [instagramInput, setInstagramInput] = useState<string>("");
  const [blogInput, setBlogInput] = useState<string>("");
  const [snsModalVisible, setSnsModalVisible] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const openIntroModal = () => {
    setIntroModalVisible(true);
  };

  const closeIntroModal = () => {
    setIntroModalVisible(false);
  };

  const openSnsModal = () => {
    setSnsModalVisible(true);
  };

  const closeSnsModal = () => {
    setSnsModalVisible(false);
  };

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const handleEditProfile = () => {};

  const getInstagramText = () => {
    if (coach?.instagram) {
      return "@" + coach.instagram.split("/").pop();
    }

    return "";
  };

  const editIntro = async () => {
    const response = await updateCoachIntro(coach?.uuid, introInput);

    if (response) {
      closeIntroModal();
      handleRefresh();
    } else {
      alert("수정 실패", "오류가 발생했습니다.");
    }
  };

  const editSNS = async () => {
    const response = await updateCoachSNS(
      coach?.uuid,
      instagramInput,
      blogInput
    );

    if (response) {
      closeSnsModal();
      handleRefresh();
    } else {
      alert("수정 실패", "오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCoachDetails(uuid);

      if (response) {
        setCoach(response);
        setIntroInput(response.introduction);
        setInstagramInput(response.instagram);
        setBlogInput(response.blog);
      }
    };

    fetchData();
  }, [refreshCount, uuid]);

  if (!coach) {
    return <ErrorPage />;
  }

  return (
    <>
      <Scroll style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.imageWrapper}>
            <View>
              <Image src={coach.profile_image} style={styles.image} />
              <TouchableOpacity
                style={styles.change}
                onPress={handleEditProfile}
                activeOpacity={0.75}
                testID="edit-profile"
              >
                <AppIcon icon="pencil" size={16} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.profile}>
            <Text style={styles.coachName}>
              {`${coach.name} `}
              <Text style={styles.sub}>코치</Text>
            </Text>
            <View style={styles.horizontal}>
              <AppIcon
                icon="person-check"
                size={20}
                color={theme.lowEmphasis}
              />
              <Text style={styles.greenText}>
                {coach.professions.map((p) => p.kor_name).join(", ")}
              </Text>
            </View>
            <View style={styles.horizontal}>
              <AppIcon icon="star" size={20} color="#F2B517" />
              <Text style={styles.grayText}>
                {coach.rating.toFixed(2)} ({coach.num_reviews})
              </Text>
            </View>
          </View>
          <Divider />
          <View style={styles.section}>
            <View style={styles.horizontalWide}>
              <Text style={styles.subtitle}>코치 소개</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={openIntroModal}
                testID="open-intro"
              >
                <AppIcon icon="pencil" size={14} color={theme.primary} />
                <Text style={styles.editText}>수정</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.normalText}>{coach.introduction}</Text>
          </View>
          <Divider />
          <View style={styles.section}>
            <View style={styles.horizontalWide}>
              <Text style={styles.subtitle}>SNS</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={openSnsModal}
                testID="open-sns"
              >
                <AppIcon icon="pencil" size={14} color={theme.primary} />
                <Text style={styles.editText}>수정</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.horizontal}>
              <View style={styles.left}>
                <Text style={styles.normalText}>인스타그램</Text>
              </View>
              <View style={styles.right}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(coach.instagram)}
                  style={styles.row}
                  testID="instagram"
                >
                  <AppIcon icon="instagram" size={20} color="#E1306C" />
                  <Text style={styles.normalText}>{getInstagramText()}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.horizontal}>
              <View style={styles.left}>
                <Text style={styles.normalText}>블로그</Text>
              </View>
              <View style={styles.right}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(coach.blog)}
                  style={styles.row}
                  testID="blog"
                >
                  <Text style={styles.normalText}>{coach.blog}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Divider />
        </View>
      </Scroll>
      <SimpleModal
        title="코치 소개글 수정"
        buttonText="저장"
        visible={introModalVisible}
        hideModal={closeIntroModal}
        onButtonPress={editIntro}
      >
        <View style={styles.modal}>
          <CalloutSmall text={"코치님을 소개해주세요!!"} />
          <TextInput
            value={introInput}
            onChangeText={setIntroInput}
            placeholder="소개글을 입력하세요."
            multiline
          />
        </View>
      </SimpleModal>
      <SimpleModal
        title="SNS"
        buttonText="저장"
        visible={snsModalVisible}
        hideModal={closeSnsModal}
        onButtonPress={editSNS}
      >
        <View style={styles.modal}>
          <Text style={styles.normalText}>인스타그램</Text>
          <TextInput
            value={instagramInput}
            onChangeText={setInstagramInput}
            placeholder="인스타그램 링크를 입력하세요."
          />
          <Text style={styles.normalText}>블로그</Text>
          <TextInput
            value={blogInput}
            onChangeText={setBlogInput}
            placeholder="블로그 링크를 입력하세요."
          />
        </View>
      </SimpleModal>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    wrapper: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 16,
    },
    imageWrapper: {
      position: "relative",
      alignItems: "center",
    },
    image: {
      width: 150,
      height: 150,
      borderRadius: 75,
    },
    change: {
      position: "absolute",
      right: 4,
      top: 4,
      backgroundColor: theme.backgroundGray,
      padding: 8,
      borderRadius: 24,
    },
    profile: {
      gap: 8,
    },
    coachName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    sub: {
      fontSize: 20,
      color: theme.highEmphasis,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    greenText: {
      fontSize: 14,
      color: theme.primary,
    },
    grayText: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    section: {
      paddingHorizontal: 4,
      gap: 16,
    },
    horizontalWide: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    editText: {
      fontSize: 16,
      color: theme.primary,
      textAlignVertical: "center",
    },
    modal: {
      marginTop: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 8,
    },
    normalText: {
      fontSize: 14,
      color: theme.highEmphasis,
    },
    left: {
      flex: 1,
    },
    right: {
      flex: 4,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
  });
