import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ErrorPage, LoadingComponent } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { ScrollView } from "@components/ScrollView";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { AuthorProfile } from "@fragments/Author";
import { Comment, PostContent } from "@fragments/Post";
import { PostDetailType } from "@models/community";
import { alert } from "@services/alert";
import { getPostDetail, createComment } from "@services/community";
import { ThemeColorType } from "@themes/colors";

export function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<PostDetailType>();
  const [newComment, setNewComment] = useState<string>("");
  const [commentMode, setCommentMode] = useState<boolean>(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { isAuthenticated, selectedProfile } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setNewComment("");
    setCommentMode(true);
    setRefreshCount(refreshCount + 1);
    Keyboard.dismiss();
  };

  const handleRecommentCancel = () => {
    setCommentMode(true);
  };

  const fetchPost = async () => {
    setLoading(true);

    const response = await getPostDetail(
      id,
      selectedProfile ? selectedProfile.id : null
    );

    if (response) {
      setPost(response);
      setError(false);
    } else {
      setError(true);
    }

    setLoading(false);
  };

  const enterRecommentMode = () => {
    setCommentMode(false);
  };

  const postComment = async () => {
    const response = await createComment(
      post?.id,
      newComment,
      selectedProfile?.id
    );

    if (response) {
      handleRefresh();
    } else {
      alert("댓글 작성 실패", "오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [refreshCount]);

  if (error) return <ErrorPage onRefresh={handleRefresh} />;
  if (post === undefined) return <LoadingComponent />;

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        keyboardVerticalOffset={100}
      >
        <ScrollView refreshing={loading} onRefresh={handleRefresh}>
          <Pressable onPress={handleRecommentCancel} testID="cancel">
            <PostContent post={post} refresh={handleRefresh} />
            {post.comments.length > 0 ? (
              <View style={styles.comments}>
                {post.comments.map((comment, index) => (
                  <Comment
                    comment={comment}
                    enterRecomment={enterRecommentMode}
                    refresh={handleRefresh}
                    recommentMode={!commentMode}
                    first={index === 0}
                    key={comment.id}
                  />
                ))}
              </View>
            ) : null}
          </Pressable>
        </ScrollView>
        {commentMode && isAuthenticated ? (
          <View style={styles.newcomment}>
            <AuthorProfile author={selectedProfile} imageOnly />
            <View style={styles.textinput}>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="댓글을 입력하세요"
              />
            </View>
            <TouchableOpacity onPress={postComment} testID="new-comment">
              <AppIcon icon="send" color={theme.primary} size={25} />
            </TouchableOpacity>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    comments: {
      marginTop: 8,
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: theme.background,
    },
    newcomment: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      gap: 4,
      backgroundColor: theme.background,
    },
    placeholder: {
      width: 24,
      height: 24,
      marginRight: 8,
      borderRadius: 12,
      backgroundColor: theme.lowEmphasis,
    },
    textinput: {
      flex: 1,
      marginHorizontal: 4,
    },
  });
