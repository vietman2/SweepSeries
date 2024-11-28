import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ReportModal } from "../Report/ReportModal";
import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { PopupMenu } from "@components/Menus";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { AuthorProfile } from "@fragments/Author";
import { ReCommentType } from "@models/community";
import { alert } from "@services/alert";
import {
  deleteRecomment,
  editRecomment,
  likeRecomment,
  reportRecomment,
} from "@services/community";
import { ThemeColorType } from "@themes/colors";

interface Props {
  recomment: ReCommentType;
  refresh: () => void;
  first?: boolean;
}

export function Recomment({
  recomment,
  refresh,
  first = false,
}: Readonly<Props>) {
  const [editedContent, setEditedContent] = useState<string>(recomment.content);

  const [actions, setActions] = useState<
    { label: string; onPress: () => void }[]
  >([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { isAuthenticated, selectedProfile } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const loginAlert = () => {
    alert("로그인이 필요합니다.", "로그인 후 이용해주세요.", () => {}, "확인");
  };

  const patchRecomment = async () => {
    const response = await editRecomment(recomment.id, editedContent);

    if (response) {
      refresh();
      setEditMode(false);
    } else {
      alert("댓글 수정 실패", "다시 시도해주세요.");
    }
  };

  const removeRecomment = async () => {
    const response = await deleteRecomment(recomment.id);

    if (response) {
      refresh();
    } else {
      alert("댓글 삭제 실패", "다시 시도해주세요.");
    }
  };

  const handleReportSubmit = async (selectedReason: string, detail: string) => {
    const response = await reportRecomment(
      recomment.id,
      selectedReason,
      detail
    );

    if (response) {
      setModalVisible(false);
      alert("신고 완료", "신고가 정상적으로 접수되었습니다.");
    } else {
      alert("신고 실패", "다시 시도해주세요.");
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated || !selectedProfile) {
      loginAlert();
      return;
    }

    const response = await likeRecomment(recomment.id, selectedProfile.id);

    if (response) {
      refresh();
    }
  };
  const handleReportPress = () => {
    setModalVisible(true);
  };

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleDeletePress = () => {
    alert(
      "댓글 삭제",
      "댓글을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?",
      () => removeRecomment(),
      "삭제",
      true
    );
  };

  useEffect(() => {
    if (recomment.is_deleted) return;
    if (recomment.is_author) {
      setActions([
        { label: "수정하기", onPress: handleToggleEditMode },
        { label: "삭제하기", onPress: handleDeletePress },
      ]);
    } else {
      setActions([{ label: "신고하기", onPress: handleReportPress }]);
    }
  }, []);

  return (
    <>
      <View style={styles.container}>
        {first ? null : <Divider />}
        <View style={styles.horizontalFull}>
          <View style={styles.horizontal}>
            <AuthorProfile author={recomment.author} />
          </View>
          {isAuthenticated && actions.length > 0 && (
            <PopupMenu items={actions}>
              <AppIcon icon="dots" color={theme.lowEmphasis} size={16} />
            </PopupMenu>
          )}
        </View>
        {editMode ? (
          <View style={styles.editContent}>
            <View style={styles.textinput}>
              <TextInput
                value={editedContent}
                onChangeText={setEditedContent}
                placeholder="댓글을 입력하세요"
              />
            </View>
            <TouchableOpacity onPress={handleToggleEditMode} testID="close">
              <AppIcon icon="close" color={theme.lowEmphasis} size={25} />
            </TouchableOpacity>
            <TouchableOpacity onPress={patchRecomment} testID="patch">
              <AppIcon icon="check" color={theme.primary} size={25} />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.content}>{recomment.content}</Text>
        )}
        <View style={styles.horizontal}>
          <Text style={styles.grayText}>{recomment.created_at}</Text>
          <TouchableOpacity
            style={styles.likeIcon}
            onPress={handleLike}
            testID="like"
          >
            <AppIcon
              icon={recomment.is_liked ? "heart" : "heart-outline"}
              color={recomment.is_liked ? theme.primary : theme.lowEmphasis}
              size={12}
            />
            <Text style={styles.likeText}>{recomment.num_likes}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ReportModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onSubmit={handleReportSubmit}
        content={recomment?.content}
      />
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginLeft: 4,
      paddingHorizontal: 4,
      paddingBottom: 8,
      gap: 4,
    },
    horizontalFull: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
    },
    placeholder: {
      width: 24,
      height: 24,
      marginRight: 8,
      borderRadius: 12,
      backgroundColor: theme.lowEmphasis,
    },
    grayText: {
      color: theme.lowEmphasis,
    },
    editContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    content: {
      marginTop: 5,
      marginBottom: 10,
      paddingLeft: 5,
    },
    textinput: {
      flex: 1,
      marginHorizontal: 5,
    },
    likeIcon: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 10,
    },
    likeText: {
      marginLeft: 2.5,
      color: theme.lowEmphasis,
    },
    dividerWrapper: {
      marginTop: 8,
    },
  });
