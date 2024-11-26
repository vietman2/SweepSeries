import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Recomment } from "./Recomment";
import { ReportModal } from "../Report/ReportModal";
import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { PopupMenu } from "@components/Menus";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { AuthorProfile } from "@fragments/Author";
import { CommentType } from "@models/community";
import { alert } from "@services/alert";
import { ThemeColorType } from "@themes/colors";

interface CommentProps {
  comment: CommentType;
  recommentMode: boolean;
  enterRecomment: () => void;
  refresh: () => void;
  first?: boolean;
}

export function Comment({
  comment,
  recommentMode,
  enterRecomment,
  refresh,
  first = false,
}: Readonly<CommentProps>) {
  const [newComment, setNewComment] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>(comment.content);
  const [like, setLike] = useState<boolean>(comment.is_liked);
  const [numLikes, setNumLikes] = useState<number>(comment.num_likes);

  const [actions, setActions] = useState<
    { label: string; onPress: () => void }[]
  >([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleReportPress = () => {
    setModalVisible(true);
  };

  const handleCommentLike = () => {
    // TODO: integrate with the backend
    setLike(!like);
  };
  const postRecomment = async () => {}; // TODO: integrate with the backend
  const removeComment = async () => {}; // TODO: integrate with the backend
  const patchComment = () => {}; // TODO: integrate with the backend
  const handleReportSubmit = async (
    selectedReason: string,
    detail: string
  ) => {
    // TODO: integrate with the backend
    console.log(selectedReason, detail);
  };

  const handleRecommentPress = () => {
    setSelected(true);
    enterRecomment();
  };

  const handleDeletePress = () => {
    alert(
      "댓글 삭제",
      "댓글을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?",
      () => removeComment(),
      "삭제",
      true
    );
  };

  useEffect(() => {
    if (comment.is_my_comment) {
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
    setNumLikes(comment.num_likes);
  }, []);

  useEffect(() => {
    if (!recommentMode) {
      setSelected(false);
    }
  }, [recommentMode]);

  return (
    <>
      <View>
        {first ? null : <Divider />}
        <View
          style={[
            styles.comment,
            {
              backgroundColor:
                selected && recommentMode
                  ? "rgba(64, 196, 20, 0.15)"
                  : theme.background,
            },
          ]}
        >
          <View style={styles.horizontalFull}>
            <View style={styles.horizontal}>
              <AuthorProfile author={comment.author} />
            </View>
            {isAuthenticated && (
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
                  placeholder="내용을 입력하세요."
                />
              </View>
              <TouchableOpacity onPress={handleToggleEditMode} testID="close">
                <AppIcon icon="close" color={theme.lowEmphasis} size={25} />
              </TouchableOpacity>
              <TouchableOpacity onPress={patchComment} testID="patch">
                <AppIcon icon="check" color={theme.primary} size={25} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.content}>
              <Text>{comment.content}</Text>
            </View>
          )}
          <View style={styles.horizontal}>
            <Text style={styles.grayText}>{comment.created_at}</Text>
            <TouchableOpacity
              style={styles.likeIcon}
              onPress={handleCommentLike}
              testID="like"
            >
              <AppIcon
                icon={like ? "heart" : "heart-outline"}
                color={like ? theme.primary : theme.lowEmphasis}
                size={12}
              />
              <Text style={styles.likeText}>{numLikes}</Text>
            </TouchableOpacity>
            <View style={styles.horizontal}>
              <AppIcon
                icon={"chat-round"}
                color={theme.lowEmphasis}
                size={16}
              />
              <Text style={styles.likeText}>{comment.num_recomments}</Text>
            </View>
            {isAuthenticated && (
              <TouchableOpacity
                onPress={handleRecommentPress}
                style={styles.recommentButton}
                testID="recomment"
              >
                <Text style={styles.grayText}>답글달기</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {comment.recomments.length > 0 ? (
          <View style={styles.recomments}>
            <AppIcon icon="downright" color={theme.lowEmphasis} size={20} />
            <View style={styles.recomment}>
              {comment.recomments.map((recomment, index) => (
                <Recomment
                  key={recomment.id}
                  recomment={recomment}
                  refresh={refresh}
                  first={index === 0}
                />
              ))}
            </View>
          </View>
        ) : null}
        {selected && recommentMode ? (
          <View style={styles.newcomment}>
            <View style={styles.placeholder} />
            <View style={styles.textinput}>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="답글을 입력하세요"
              />
            </View>
            <TouchableOpacity onPress={postRecomment} testID="send">
              <AppIcon icon="send" color={theme.primary} size={25} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      <ReportModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onSubmit={handleReportSubmit}
        content={comment?.content}
      />
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    comment: {
      marginVertical: 4,
      paddingVertical: 4,
      paddingLeft: 8,
      paddingRight: 4,
      gap: 4,
      borderRadius: 4,
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
    content: {
      marginTop: 4,
      marginBottom: 8,
      paddingLeft: 4,
    },
    grayText: {
      color: theme.lowEmphasis,
    },
    placeholder: {
      width: 24,
      height: 24,
      marginRight: 8,
      borderRadius: 12,
      backgroundColor: theme.lowEmphasis,
    },
    editContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    textinput: {
      flex: 1,
      marginHorizontal: 4,
    },
    newcomment: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      backgroundColor: theme.background,
    },
    likeIcon: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 8,
    },
    likeText: {
      marginLeft: 4,
      color: theme.lowEmphasis,
    },
    recomments: {
      flex: 1,
      flexDirection: "row",
      marginVertical: 8,
      paddingLeft: 16,
    },
    recomment: {
      flex: 1,
    },
    recommentButton: {
      marginLeft: 8,
    },
  });
