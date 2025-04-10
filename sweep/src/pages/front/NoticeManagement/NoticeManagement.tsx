import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { launchImageLibraryAsync, ImagePickerAsset } from "expo-image-picker";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { SimpleModal } from "@components/Modals";
import { ScrollView } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useAcademyFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { NoticeSimple } from "@fragments/Notice";
import { alert } from "@services/alert";
import { createNotice } from "@services/products";
import { ThemeColorType } from "@themes/colors";

const typeChoices = ["공지", "이벤트", "기타"];

export function NoticeManagement() {
  const [selectedType, setSelectedType] = useState<string>(typeChoices[0]);
  const [titleInput, setTitleInput] = useState<string>("");
  const [contentInput, setContentInput] = useState<string>("");
  const [imageInput, setImageInput] = useState<ImagePickerAsset>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { academy, notices, loading, refresh } = useAcademyFront();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const hideModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const handleImageUpload = async () => {
    const result = await launchImageLibraryAsync({
      allowsMultipleSelection: false,
    });

    if (result.canceled) return;

    setImageInput(result.assets[0]);
  };

  if (!academy) return null;

  const postNotice = async () => {
    const response = await createNotice(
      academy.uuid,
      selectedType,
      titleInput,
      contentInput,
      imageInput
    );

    if (response) {
      refresh();
      hideModal();
    } else {
      alert("소식 작성 실패", "소식을 작성하는데 실패했습니다.");
    }
  };

  const handleNoticePress = (id: number) => {
    router.push(`/front/academy/${academy.uuid}/notices/${id}`);
  };

  return (
    <>
      <ScrollView refreshing={loading} onRefresh={refresh}>
        <View style={styles.container}>
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
              <TouchableOpacity
                onPress={() => handleNoticePress(notice.id)}
                testID={`notice-${notice.id}`}
              >
                <NoticeSimple notice={notice} />
              </TouchableOpacity>
              <Divider />
            </View>
          ))}
        </View>
      </ScrollView>
      <SimpleModal
        title="소식 작성"
        buttonText="저장"
        visible={modalVisible}
        hideModal={hideModal}
        onButtonPress={postNotice}
        large
      >
        <View style={styles.modal}>
          <View style={styles.wrapper}>
            <Text style={styles.subtitle}>분류</Text>
            <View style={styles.row}>
              {typeChoices.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedType(type)}
                  style={styles.typeChip}
                  testID={type}
                >
                  <AppIcon
                    icon="check-circle"
                    size={16}
                    color={selectedType === type ? theme.primary : theme.border}
                  />
                  <Text>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.wrapper}>
            <Text style={styles.subtitle}>제목</Text>
            <TextInput
              placeholder="제목을 입력해주세요"
              value={titleInput}
              onChangeText={setTitleInput}
              style={styles.textinput}
            />
          </View>
          <View style={styles.wrapper}>
            <View style={styles.header}>
              <Text style={styles.subtitle}>내용</Text>
              <TouchableOpacity
                onPress={handleImageUpload}
                testID="image-upload"
              >
                <AppIcon
                  icon="camera-outline"
                  size={24}
                  color={theme.primary}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="내용을 입력해주세요"
              value={contentInput}
              onChangeText={setContentInput}
              style={[styles.textinput, { height: 200 }]}
              multiline
            />
            {imageInput && (
              <View style={styles.row}>
                <AppIcon icon="plus" size={16} color={theme.primary} />
                <Text>{imageInput.fileName}</Text>
              </View>
            )}
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
    wrapper: {
      gap: 8,
    },
    textinput: {
      height: 40,
      paddingHorizontal: 12,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 4,
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
      gap: 12,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    typeChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });
