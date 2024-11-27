import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { ReportModal } from "../Report/ReportModal";
import { Tag } from "../Tag/Tag";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { PopupMenu } from "@components/Menus";
import { GSScroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { AuthorProfile } from "@fragments/Author";
import { PostDetailType } from "@models/community";
import { alert } from "@services/alert";
import { deletePost, likePost } from "@services/community";
import { ThemeColorType } from "@themes/colors";

interface Props {
  post: PostDetailType;
  refresh: () => void;
}

export function PostContent({ post, refresh }: Readonly<Props>) {
  const [editedTitle, setEditedTitle] = useState<string>(post.title);
  const [editedContent, setEditedContent] = useState<string>(post.content);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [actions, setActions] = useState<
    { label: string; onPress: () => void }[]
  >([]);

  const { isAuthenticated, selectedProfile } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const loginAlert = () => {
    alert("로그인이 필요합니다.", "로그인 후 이용해주세요.", () => {}, "확인");
  };

  const handleEditSubmit = () => {}; // TODO: integrate with the backend

  const removePost = async () => {
    const response = await deletePost(post.id);

    if (response) {
      router.back();
    } else {
      alert("삭제 실패", "게시글을 삭제하는 데 실패했습니다.");
    }
  };

  const handleReportSubmit = () => {}; // TODO: integrate with the backend

  const handleLike = async () => {
    if (!isAuthenticated) {
      loginAlert();
      return;
    }

    const response = await likePost(post.id, selectedProfile?.id);

    if (response) {
      refresh();
    }
  };

  const cancelEdit = () => {
    setEditedTitle(post.title);
    setEditedContent(post.content);
    setEditMode(false);
  };

  const handleDeletePress = () => {
    alert(
      "게시글 삭제",
      "게시글을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?",
      () => removePost(),
      "삭제",
      true
    );
  };

  const handleReportPress = () => {
    setModalVisible(true);
  };

  const onEditPress = () => {
    setEditMode(true);
  };

  useEffect(() => {
    if (post.is_author) {
      setActions([
        { label: "수정하기", onPress: onEditPress },
        { label: "삭제하기", onPress: handleDeletePress },
      ]);
    } else {
      setActions([{ label: "신고하기", onPress: handleReportPress }]);
    }
  }, []);

  return (
    <>
      <View style={styles.post}>
        <View style={styles.tag}>
          <Tag tag={post.tag} type={1} />
        </View>
        <View style={styles.horizontal}>
          <View style={styles.horizontal}>
            <AuthorProfile author={post.author} />
            <Text style={styles.grayText}>{`${post.created_at}`}</Text>
          </View>
          {isAuthenticated && (
            <PopupMenu items={actions}>
              <AppIcon icon="dots" color={theme.lowEmphasis} size={20} />
            </PopupMenu>
          )}
        </View>
        {editMode ? (
          <>
            <TextInput
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="제목을 입력하세요."
            />
            <TextInput
              value={editedContent}
              onChangeText={setEditedContent}
              placeholder="내용을 입력하세요."
              multiline
            />
            <View style={styles.editButtons}>
              <TextButton
                text="취소"
                onPress={cancelEdit}
                backgroundColor={theme.lowEmphasis}
                color="white"
              />
              <TextButton text="수정" onPress={handleEditSubmit} />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.body}>{post.content}</Text>
          </>
        )}
        {post.images.length > 0 && (
          <GSScroll
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator
          >
            {post.images.map((image) => (
              <View key={image.id}>
                <ImagePreview uri={image.url} />
              </View>
            ))}
          </GSScroll>
        )}
        <View style={styles.footer}>
          <View style={styles.count}>
            <AppIcon icon="eye" size={20} color={theme.lowEmphasis} />
            <Text style={styles.countText}>{post.num_views}</Text>
          </View>
          <TouchableOpacity
            onPress={handleLike}
            style={styles.count}
            testID="like"
          >
            {post.is_liked ? (
              <AppIcon icon="heart" size={16} color={theme.primary} />
            ) : (
              <AppIcon
                icon="heart-outline"
                size={16}
                color={theme.lowEmphasis}
              />
            )}
            <Text style={styles.countText}> {post.num_likes}</Text>
          </TouchableOpacity>
          <View style={styles.count}>
            <AppIcon icon="chat-round" size={20} color={theme.lowEmphasis} />
            <Text style={styles.countText}>{post.num_comments}</Text>
          </View>
        </View>
      </View>
      <ReportModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onSubmit={handleReportSubmit}
        content={post?.content}
      />
    </>
  );
}

function ImagePreview({ uri }: { uri: string }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.imageContainer}>
      <Image src={uri} style={styles.image} />
    </View>
  );
}

function TextButton({
  text,
  onPress,
  color,
  backgroundColor,
}: {
  text: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  color = color || theme.background;
  backgroundColor = backgroundColor || theme.primary;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    post: {
      marginTop: 4,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    tag: {
      marginTop: 10,
      marginBottom: 15,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
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
    authorText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    imageContainer: {
      width: 140,
      height: 140,
      marginRight: 12,
      marginBottom: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 140,
      height: 140,
      borderRadius: 12,
    },
    title: {
      marginTop: 12,
      fontWeight: "bold",
      fontSize: 24,
    },
    body: {
      marginVertical: 16,
      fontSize: 16,
      color: theme.highEmphasis,
      lineHeight: 24,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginBottom: 8,
      gap: 8,
    },
    count: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 2,
    },
    countText: {
      color: "gray",
    },
    editButtons: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 8,
      marginBottom: 16,
      gap: 8,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 4,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    buttonText: {
      fontSize: 16,
    },
  });
