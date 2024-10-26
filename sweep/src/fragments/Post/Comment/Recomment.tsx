import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ReportModal } from "../Report/ReportModal";
import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { PopupMenu } from "@components/Menus";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ReCommentType } from "@models/community";
import { alert } from "@services/alert";
import { ThemeColorType } from "@themes/colors";

interface Props {
  recomment: ReCommentType;
  refresh: () => void;
}

export function Recomment({ recomment, refresh }: Readonly<Props>) {
  const [editedContent, setEditedContent] = useState<string>(recomment.content);
  const [like, setLike] = useState<boolean>(recomment.is_liked);
  const [numLikes, setNumLikes] = useState<number>(recomment.num_likes);

  const [actions, setActions] = useState<
    { label: string; onPress: () => void }[]
  >([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const patchRecomment = async () => {}; // TODO: integrate with the backend
  const handleLike = async () => {}; // TODO: integrate with the backend
  const removeRecomment = async () => {}; // TODO: integrate with the backend
  const handleReportSubmit = async () => {}; // TODO: integrate with the backend

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
    if (recomment.is_my_recomment) {
      setActions([
        { label: "신고하기", onPress: handleReportPress },
        { label: "차단하기", onPress: () => {} },
        { label: "수정하기", onPress: handleToggleEditMode },
        { label: "삭제하기", onPress: handleDeletePress },
      ]);
    } else {
      setActions([
        { label: "신고하기", onPress: handleReportPress },
        { label: "차단하기", onPress: () => {} },
      ]);
    }
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.horizontalFull}>
          <View style={styles.horizontal}>
            <View style={styles.placeholder} />
            <Text style={styles.grayText}>{recomment.commenter_nickname}</Text>
          </View>
          <PopupMenu items={actions}>
            <AppIcon icon="dots" color={theme.lowEmphasis} size={16} />
          </PopupMenu>
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
              icon={like ? "heart" : "heart-outline"}
              color={like ? theme.primary : theme.lowEmphasis}
              size={12}
            />
            <Text style={styles.likeText}>{numLikes}</Text>
          </TouchableOpacity>
        </View>
        <Divider />
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
      marginLeft: 5,
      paddingHorizontal: 5,
      paddingBottom: 10,
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
  });
