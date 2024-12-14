import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { SimpleModal } from "@components/Modals";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { NoticeSimple } from "@fragments/Notice";
import { NoticeSimpleType } from "@models/products";
import { createNotice, getNotices } from "@services/products";
import { alert } from "@services/alert";
import { ThemeColorType } from "@themes/colors";

interface Props {
  uuid: string;
}

export function NoticeManagement({ uuid }: Readonly<Props>) {
  const [notices, setNotices] = useState<NoticeSimpleType[]>([]);
  const [titleInput, setTitleInput] = useState<string>("");
  const [contentInput, setContentInput] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const postNotice = async () => {
    const response = await createNotice(uuid, titleInput, contentInput);

    if (response) {
      handleRefresh();
      hideModal();
    } else {
      alert("소식 작성 실패", "소식을 작성하는데 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getNotices(uuid);

      if (response) {
        setNotices(response);
      } else {
        setNotices([]);
      }
    };

    fetchData();
  }, [refreshCount]);

  return (
    <>
      <Scroll style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>내 소식</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={openModal}
              testID="open"
            >
              <AppIcon icon="pencil" size={14} color={theme.primary} />
              <Text style={styles.editText}>작성하기</Text>
            </TouchableOpacity>
          </View>
          {notices.map((notice) => (
            <View key={notice.id} style={styles.notice}>
              <NoticeSimple notice={notice} />
              <Divider />
            </View>
          ))}
        </View>
      </Scroll>
      <SimpleModal
        title="소식 작성"
        buttonText="저장"
        visible={modalVisible}
        hideModal={hideModal}
        onButtonPress={postNotice}
        large
      >
        <View style={styles.modal}>
          <View>
            <Text style={styles.subtitle}>제목</Text>
            <TextInput
              placeholder="제목을 입력해주세요"
              value={titleInput}
              onChangeText={setTitleInput}
            />
          </View>
          <View>
            <Text style={styles.subtitle}>내용</Text>
            <TextInput
              placeholder="내용을 입력해주세요"
              value={contentInput}
              onChangeText={setContentInput}
              multiline
            />
          </View>
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
    content: {
      padding: 16,
      gap: 24,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    notice: {
      gap: 16,
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
      padding: 16,
      gap: 16,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });
