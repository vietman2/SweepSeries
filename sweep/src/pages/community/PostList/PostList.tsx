import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { SvgIconButton } from "@components/Buttons";
import { Scroll, ScrollView } from "@components/ScrollView";
import { Searchbar } from "@components/Search";
import { useTheme } from "@contexts/theme";
import { PostSimple, Tag } from "@fragments/Post";
import { PostSimpleType, TagType } from "@models/community";
import { samplePosts, sampleTags } from "@testdata/community";
import { ThemeColorType } from "@themes/colors";

interface Props {
  mode: "덕아웃" | "드래프트" | "마켓";
}

export function PostList({ mode }: Readonly<Props>) {
  const [posts, setPosts] = useState<PostSimpleType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tagChoices, setTagChoices] = useState<TagType[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);

  //const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const handlePostPress = async (post: PostSimpleType) => {
    router.push({
      pathname: "/community/[id]",
      params: { id: post.id },
    });
  };

  const handleTagPress = (tag: TagType) => {
    if (selectedTag && selectedTag.id === tag.id) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    // TODO: fetch posts from the backend
    console.log(mode); // 덕아웃, 드래프트, 마켓
    if (!selectedTag) setPosts(samplePosts);
    else if (selectedTag === sampleTags[0]) {
      setPosts([samplePosts[0]]);
    } else {
      setPosts([samplePosts[1], samplePosts[2]]);
    }
    setTagChoices([sampleTags[0], sampleTags[1]]);
    setLoading(false);
  };

  const handleCreatePost = () => {
    // router.push("/community/create");
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshCount, selectedTag]);

  return (
    <>
      <ScrollView refreshing={loading} onRefresh={handleRefresh}>
        <View style={styles.container}>
          <View style={styles.horizontal}>
            <View style={styles.searchbar}>
              <Searchbar
                placeholder="제목, 내용으로 검색하세요"
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleRefresh}
              />
            </View>
          </View>
          <Scroll horizontal style={styles.tags}>
            {tagChoices.map((tag) => (
              <TouchableOpacity
                onPress={() => handleTagPress(tag)}
                testID={tag.name}
                key={tag.id}
              >
                <Tag
                  tag={tag}
                  type={2}
                  selected={selectedTag ? tag.id === selectedTag.id : false}
                />
              </TouchableOpacity>
            ))}
          </Scroll>
          {posts.map((post) => (
            <TouchableOpacity
              onPress={() => handlePostPress(post)}
              key={post.id}
              testID={`post-id-${post.id}`}
            >
              <PostSimple post={post} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.button}>
        <SvgIconButton
          icon="pencil"
          text="글쓰기"
          color={theme.background}
          backgroundColor={theme.primary}
          onPress={handleCreatePost}
        />
      </View>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      marginVertical: 8,
      paddingBottom: 24,
      paddingHorizontal: 16,
    },
    horizontal: {
      flexDirection: "row",
      marginTop: 4,
    },
    searchbar: {
      flex: 1,
      marginTop: 8,
    },
    sort: {
      marginVertical: 12,
      marginLeft: 12,
    },
    tags: {
      marginVertical: 4,
      marginLeft: -4,
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
    button: {
      position: "absolute",
      bottom: 20,
      right: 20,
    },
  });
