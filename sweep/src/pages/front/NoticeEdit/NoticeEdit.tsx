import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { TextButton } from "@components/Buttons";
import { LoadingComponent } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { NoticeBlock } from "@fragments/Notice";
import { NoticeSimpleType } from "@models/products";
import { alert } from "@services/alert";
import { deleteNotice, editNotice, getNotice } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function NoticeEdit() {
  const [notice, setNotice] = useState<NoticeSimpleType>();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");

  const { id, academyId } = useLocalSearchParams<{
    id: string;
    academyId: string;
  }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleEditSubmit = async () => {
    const response = await editNotice(
      academyId,
      id,
      editedTitle,
      editedContent
    );

    if (response) {
      setEditMode(false);
      setNotice(response);
    } else {
      alert("공지 수정 실패", "공지를 수정하는데 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    const response = await deleteNotice(academyId, id);

    if (response) {
      router.back();
    } else {
      alert("공지 삭제 실패", "공지를 삭제하는데 실패했습니다.");
    }
  };

  const handleDeletePress = () => {
    alert(
      "공지 삭제",
      "정말로 삭제하시겠습니까?",
      handleDelete,
      "삭제하기",
      true
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getNotice(academyId, id);

      if (response) {
        setNotice(response);
        const title = response.title;
        // cut the first word from the title
        const editedTitle = title.slice(title.indexOf(" ") + 1);
        setEditedTitle(editedTitle);
        setEditedContent(response.content);
      }
    };

    fetchData();
  }, [id]);

  if (!notice) {
    return <LoadingComponent />;
  }

  return (
    <ScrollView style={styles.container}>
      {editMode ? (
        <View style={styles.editModeContainer}>
          <Text style={styles.date}>
            {notice.updated_at}
            <Text style={styles.green}>{"\t수정 중"}</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            value={editedTitle}
            onChangeText={setEditedTitle}
          />
          <TextInput
            style={[styles.textInput, { height: 200 }]}
            value={editedContent}
            onChangeText={setEditedContent}
            multiline
          />
          <View style={styles.editButtons}>
            <View style={styles.editButton}>
              <TextButton
                text="취소"
                onPress={() => setEditMode(false)}
                backgroundColor={theme.lowEmphasis}
              />
            </View>
            <View style={styles.editButton}>
              <TextButton text="저장" onPress={handleEditSubmit} />
            </View>
          </View>
        </View>
      ) : (
        <>
          <NoticeBlock notice={notice} />
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleEdit}
              testID="edit-button"
            >
              <AppIcon icon="pencil" size={18} color={theme.primary} />
              <Text style={styles.green}>수정하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleDeletePress}
              testID="delete-button"
            >
              <AppIcon icon="trash" size={24} color={theme.lowEmphasis} />
              <Text style={{ color: theme.lowEmphasis }}>삭제하기</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 16,
      gap: 8,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    editModeContainer: {
      paddingVertical: 24,
      paddingHorizontal: 16,
      gap: 16,
    },
    date: {
      color: theme.lowEmphasis,
    },
    green: {
      color: theme.primary,
    },
    textInput: {
      height: 40,
      paddingHorizontal: 12,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 4,
    },
    editButtons: {
      flexDirection: "row",
      gap: 8,
    },
    editButton: {
      flex: 1,
    },
  });
