import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { ErrorPage, LoadingComponent } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
//import { PopupMenu } from "@components/Menus";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { Tag } from "@fragments/Post";
import { TagType } from "@models/community";
import { alert } from "@services/alert";
import { getTags, createPost } from "@services/community";
import { ThemeColorType } from "@themes/colors";

const forums = ["덕아웃", "드래프트", "마켓"];

type ImageAssetType = {
  id: number;
  url: string;
  fileName: string | undefined | null;
};

export function PostCreate() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedForum, setSelectedForum] = useState<string>("덕아웃");
  const [tagChoices, setTagChoices] = useState<Record<string, TagType[]>>({});
  const [selectedTag, setSelectedTag] = useState<TagType>();
  //const [uploadedImages, setUploadedImages] = useState<ImageAssetType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { selectedProfile } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleForumSelect = (forum: string) => {
    setSelectedForum(forum);
    setSelectedTag(tagChoices[forum][0]);
  };

  /*
  const takePhoto = async () => {
    // TODO: Implement camera
    
    const result = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
    });

    console.log("qwer", result);
  };

  const uploadImage = async () => {
    // TODO: Implement image upload
    
    console.log("asdf");
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsMultipleSelection: false,
    });

    console.log("qwer", result);

    if (result.canceled) return;

    const image = result as ImagePickerSuccessResult;
    const imageAsset = image.assets[0];

    if (uploadedImages.some((img) => img.fileName === imageAsset.fileName)) {
      // if same image is already uploaded, skip
      alert("", "이미 업로드된 사진입니다.");
      return;
    }

    setLoading(true);
    const response = await uploadImageFile(imageAsset);

    if (response) {
      const url: string = response.url;
      const id: number = response.id;

      setUploadedImages((prev) => [
        ...prev,
        { id, url, fileName: imageAsset.fileName },
      ]);
    } else {
      alert("오류", "이미지 업로드에 실패했습니다.");
    }

    setLoading(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const imageActions = [
    { label: "사진 촬영하기", onPress: takePhoto },
    { label: "앨범에서 선택", onPress: uploadImage },
  ];*/

  const handlePostCreate = async () => {
    const response = await createPost(
      title,
      content,
      selectedForum,
      selectedTag?.id,
      [], //uploadedImages.map((img) => img.url),
      selectedProfile?.id
    );

    if (response) {
      alert("성공", "게시글이 등록되었습니다.");
      router.replace({
        pathname: "/community/[id]",
        params: { id: response.id },
      });
    } else {
      alert("오류", "게시글 등록에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      const response = await getTags();

      if (response) {
        setTagChoices(response);
        setSelectedTag(response[selectedForum][0]);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    fetchTags();
  }, [refreshCount]);

  if (loading) return <LoadingComponent />;
  if (error) return <ErrorPage onRefresh={handleRefresh} />;

  return (
    <View style={styles.container}>
      <Scroll>
        <View style={styles.innerContainer}>
          <View style={styles.forumsContainer}>
            {forums.map((forum) => (
              <TouchableOpacity
                onPress={() => handleForumSelect(forum)}
                style={[
                  styles.chipContainer,
                  {
                    backgroundColor:
                      selectedForum === forum
                        ? theme.primary
                        : theme.background,
                  },
                ]}
                testID={forum}
                key={forum}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedForum === forum && {
                      color: theme.background,
                      fontWeight: "600",
                    },
                  ]}
                >
                  {forum}
                </Text>
                <AppIcon
                  icon="check"
                  color={selectedForum === forum ? "white" : "transparent"}
                  size={20}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View>
            <Scroll horizontal style={styles.tags}>
              {tagChoices[selectedForum].map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  onPress={() => setSelectedTag(tag)}
                  testID={tag.name}
                >
                  <Tag tag={tag} type={2} selected={selectedTag === tag} />
                </TouchableOpacity>
              ))}
            </Scroll>
          </View>
          <TextInput
            placeholder="제목을 입력해주세요. (최대 40자)"
            value={title}
            onChangeText={setTitle}
          />
          <View style={styles.content}>
            <TextInput
              placeholder="내용을 입력해주세요."
              value={content}
              onChangeText={setContent}
              multiline
            />
          </View>
        </View>
      </Scroll>
      <Divider />
      {/*
      <View style={styles.imageContainer}>
        {uploadedImages.length > 0 ? (
          <View style={styles.images}>
            {uploadedImages.map((img) => (
              <ImagePreview
                key={img.fileName}
                uri={img.url}
                removeImage={() => removeImage(uploadedImages.indexOf(img))}
              />
            ))}
          </View>
        ) : null}
        <View style={styles.horizontal}>
          <PopupMenu items={imageActions}>
            <AppIcon icon="camera-outline" color={theme.border} size={24} />
          </PopupMenu>
        </View>
      </View>*/}
      <TextButton text="등록" onPress={handlePostCreate} />
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      gap: 12,
      backgroundColor: theme.background,
    },
    innerContainer: {
      flex: 1,
      gap: 8,
    },
    forumsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    chipContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 12,
      paddingRight: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 0.5,
      borderColor: theme.lowEmphasis,
    },
    chipText: {
      color: theme.highEmphasis,
      fontSize: 16,
    },
    tags: {
      marginBottom: 5,
      marginLeft: -2.5,
      paddingVertical: 5,
      paddingHorizontal: 5,
    },
    content: {
      flex: 1,
    },
  });
