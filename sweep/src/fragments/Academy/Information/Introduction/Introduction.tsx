import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { SimpleModal } from "@components/Modals";
import { CalloutSmall } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { alert } from "@services/alert";
import { updateAcademyIntroduction } from "@services/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  introduction: string;
  edit?: boolean;
  onRefresh?: () => void;
}

export function Introduction({
  introduction,
  edit = false,
  onRefresh,
}: Readonly<Props>) {
  const [introInput, setIntroInput] = useState<string>(introduction);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const hideModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const editIntro = async () => {
    const response = await updateAcademyIntroduction(id, introInput);

    if (response) {
      hideModal();
      if (onRefresh) {
        onRefresh();
      }
    } else {
      alert("수정 실패", "오류가 발생했습니다.");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>아카데미 소개</Text>
          {edit && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={openModal}
              testID="open"
            >
              <AppIcon icon="pencil" size={12} color={theme.primary} />
              <Text style={styles.editText}>수정</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text
          numberOfLines={expanded ? 0 : 5}
          ellipsizeMode="tail"
          style={styles.text}
        >
          {introduction}
        </Text>
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={styles.wrapper}
          testID="expand-button"
        >
          <AppIcon
            icon={expanded ? "chevron-up" : "chevron-down"}
            size={14}
            color={theme.highEmphasis}
          />
        </TouchableOpacity>
      </View>
      <SimpleModal
        title="아카데미 소개"
        buttonText="저장"
        visible={modalVisible}
        hideModal={hideModal}
        onButtonPress={editIntro}
      >
        <View style={styles.body}>
          <CalloutSmall
            text={
              "자세한 레슨 커리큘럼 등 자신의 아카데미를 돋보이게 소개해주세요!!"
            }
          />
          <TextInput
            value={introInput}
            onChangeText={setIntroInput}
            placeholder="소개글을 입력하세요."
            multiline
          />
        </View>
      </SimpleModal>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    text: {
      fontSize: 14,
      lineHeight: 20,
    },
    wrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 16,
    },
    body: {
      marginTop: 8,
      paddingHorizontal: 16,
      gap: 8,
    },
    header: {
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
      gap: 2,
    },
    editText: {
      fontSize: 16,
      color: theme.primary,
      textAlignVertical: "center",
    },
  });
