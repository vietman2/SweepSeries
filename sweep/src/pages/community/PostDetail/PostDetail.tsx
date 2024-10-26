import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
//import { useLocalSearchParams } from "expo-router";

import { ErrorPage } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { ScrollView } from "@components/ScrollView";
import { useTheme } from "@contexts/theme";
import { Comment, PostContent } from "@fragments/Post";
import { PostDetailType } from "@models/community";
import { ThemeColorType } from "@themes/colors";
import { samplePostDetail } from "@testdata/community";

export function PostDetail() {
//  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<PostDetailType>();
  const [newComment, setNewComment] = useState<string>("");
  const [commentMode, setCommentMode] = useState<boolean>(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);
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
    //const response = await getPostDetail(postId, token);

    //if (response.status === 200) {
    //  setPost(response.data);
    //  setError(false);
    //} else {
    //  setError(true);
    //}

    setPost(samplePostDetail);
    setError(false);

    setLoading(false);
  };

  const enterRecommentMode = () => {
    setCommentMode(false);
  };

  const postComment = () => {};

  useEffect(() => {
    fetchPost();
  }, [refreshCount]);

  if (error || post === undefined)
    return <ErrorPage onRefresh={handleRefresh} />;

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        keyboardVerticalOffset={100}
      >
        <ScrollView refreshing={loading} onRefresh={handleRefresh}>
          <Pressable onPress={handleRecommentCancel} testID="cancel">
            <PostContent post={post} />
            {post.comments.length > 0 ? (
              <View style={styles.comments}>
                {post.comments.map((comment) => (
                  <Comment
                    comment={comment}
                    enterRecomment={enterRecommentMode}
                    refresh={handleRefresh}
                    recommentMode={!commentMode}
                    key={comment.id}
                  />
                ))}
              </View>
            ) : null}
          </Pressable>
        </ScrollView>
        {commentMode ? (
          <View style={styles.newcomment}>
            <View style={styles.placeholder} />
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
      paddingHorizontal: 10,
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
      marginHorizontal: 5,
    },
  });
