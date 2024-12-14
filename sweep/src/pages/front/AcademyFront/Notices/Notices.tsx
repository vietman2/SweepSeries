import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { SimpleModal } from "@components/Modals";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { NoticeSimple } from "@fragments/Notice";
import { NoticeSimpleType } from "@models/products";
import { sampleNotices } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function NoticeManagement() {
  const [notices, setNotices] = useState<NoticeSimpleType[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const hideModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const postNotice = async () => {
    hideModal();
  };

  useEffect(() => {
    setNotices(sampleNotices);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>내 소식</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={openModal}
            testID="open"
          >
            <AppIcon icon="pencil" size={12} color={theme.primary} />
            <Text style={styles.editText}>작성하기</Text>
          </TouchableOpacity>
        </View>
        {notices.map((notice) => (
          <View key={notice.id} style={styles.notice}>
            <NoticeSimple key={notice.id} notice={notice} />
            <Divider />
          </View>
        ))}
      </View>
      <SimpleModal
        title="소식 작성"
        buttonText="저장"
        visible={modalVisible}
        hideModal={hideModal}
        onButtonPress={postNotice}
      >
        <View style={styles.modal}></View>
      </SimpleModal>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      gap: 24,
      backgroundColor: theme.background,
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
      gap: 2,
    },
    editText: {
      fontSize: 16,
      color: theme.primary,
      textAlignVertical: "center",
    },
    modal: {},
  });
