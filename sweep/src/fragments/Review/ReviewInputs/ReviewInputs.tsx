import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ImagePickerAsset, launchImageLibraryAsync } from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ReviewTagType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  type: 1 | 2 | 3;
  values: {
    rating: number;
    comment: string;
    images: ImagePickerAsset[];
    tagIds: number[];
    secure?: boolean;
  };
  setValues: (values: {
    rating: number;
    comment: string;
    images: ImagePickerAsset[];
    tagIds: number[];
    secure?: boolean;
  }) => void;
  tagOptions: { positives: ReviewTagType[]; negatives: ReviewTagType[] };
}

export function ReviewInputs({
  type,
  values,
  setValues,
  tagOptions,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const subtitles = [
    "레슨 후기를 알려주세요!",
    "코치님은 어땠나요?",
    "아카데미는 어땠나요?",
  ];
  const placeholders = [
    "레슨에 대한 솔직한 리뷰를 남겨주세요.",
    "코치님에 대한 솔직한 리뷰를 남겨주세요.",
    "아카데미에 대한 솔직한 리뷰를 남겨주세요.",
  ];

  const setRating = (rating: number) => {
    if (rating < 3) {
      setValues({ ...values, tagIds: [tagOptions.negatives[0].id], rating });
    } else {
      setValues({ ...values, tagIds: [tagOptions.positives[0].id], rating });
    }
  };

  const setComment = (comment: string) => {
    setValues({ ...values, comment });
  };

  const pressTag = (tagId: number) => {
    if (values.tagIds.includes(tagId)) {
      setValues({
        ...values,
        tagIds: values.tagIds.filter((id) => id !== tagId),
      });
    } else {
      setValues({ ...values, tagIds: [...values.tagIds, tagId] });
    }
  };

  const selectImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 3,
    });

    if (!result.canceled) {
      setValues({ ...values, images: result.assets });
    }
  };

  const removeImage = (image: ImagePickerAsset) => {
    setValues({
      ...values,
      images: values.images.filter((img) => img.uri !== image.uri),
    });
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.subtitle}>{subtitles[type - 1]}</Text>
      <Ratings rating={values.rating} setRating={setRating} />
      {values.rating > 0 && (
        <View style={styles.tags}>
          {values.rating > 2
            ? tagOptions.positives.map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  onPress={() => pressTag(tag.id)}
                  testID={`tag-${tag.id}`}
                >
                  <Chip
                    text={tag.tag}
                    selected={values.tagIds.includes(tag.id)}
                  />
                </TouchableOpacity>
              ))
            : tagOptions.negatives.map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  onPress={() => pressTag(tag.id)}
                  testID={`tag-${tag.id}`}
                >
                  <Chip
                    text={tag.tag}
                    selected={values.tagIds.includes(tag.id)}
                  />
                </TouchableOpacity>
              ))}
        </View>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          value={values.comment}
          onChangeText={setComment}
          placeholder={placeholders[type - 1]}
          multiline
          style={styles.textinput}
          testID="comment-input"
        />
        <Text style={styles.length}>
          <Text
            style={{
              color: values.comment.length > 500 ? "red" : theme.lowEmphasis,
            }}
          >
            {values.comment.length}
          </Text>{" "}
          / 500
        </Text>
      </View>
      <View style={styles.imagePicker}>
        {values.images.length > 0 ? (
          <View style={styles.tags}>
            {values.images.map((image) => (
              <View key={image.uri} style={styles.image}>
                <Image source={{ uri: image.uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImage}
                  onPress={() => removeImage(image)}
                  testID="remove-image"
                >
                  <AppIcon icon="close" size={16} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.imageButton}
            onPress={selectImage}
            testID="select-image"
          >
            <AppIcon icon="camera-outline" size={24} color={theme.primary} />
            <Text style={styles.imageText}>사진 추가</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

interface RatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

function Ratings({ rating, setRating }: Readonly<RatingProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.stars}>
      <TouchableOpacity
        onPress={() => setRating(1)}
        activeOpacity={0.5}
        testID="rating-1"
      >
        <AppIcon
          icon="star"
          size={36}
          color={rating >= 1 ? "#F2B517" : theme.border}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setRating(2)}
        activeOpacity={0.5}
        testID="rating-2"
      >
        <AppIcon
          icon="star"
          size={36}
          color={rating >= 2 ? "#F2B517" : theme.border}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setRating(3)}
        activeOpacity={0.5}
        testID="rating-3"
      >
        <AppIcon
          icon="star"
          size={36}
          color={rating >= 3 ? "#F2B517" : theme.border}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setRating(4)}
        activeOpacity={0.5}
        testID="rating-4"
      >
        <AppIcon
          icon="star"
          size={36}
          color={rating >= 4 ? "#F2B517" : theme.border}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setRating(5)}
        activeOpacity={0.5}
        testID="rating-5"
      >
        <AppIcon
          icon="star"
          size={36}
          color={rating == 5 ? "#F2B517" : theme.border}
        />
      </TouchableOpacity>
    </View>
  );
}

interface ChipProps {
  text: string;
  selected: boolean;
}

function Chip({ text, selected }: Readonly<ChipProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (selected) {
    return (
      <LinearGradient
        colors={["#00BF60", "#00592D"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.chip}
      >
        <Text style={[styles.chipText, { color: theme.background }]}>
          {text}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    wrapper: {
      gap: 16,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.highEmphasis,
    },
    tags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    inputWrapper: {
      position: "relative",
    },
    textinput: {
      minHeight: 120,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.lowEmphasis,
      textAlignVertical: "top",
      fontSize: 14,
      lineHeight: 24,
    },
    length: {
      paddingHorizontal: 4,
      position: "absolute",
      bottom: 8,
      right: 8,
      fontSize: 12,
      color: theme.border,
      backgroundColor: theme.background,
      borderRadius: 4,
    },
    imagePicker: {
      alignItems: "flex-end",
      marginTop: -12,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 4,
    },
    removeImage: {
      position: "absolute",
      top: 4,
      right: 4,
      borderRadius: 12,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    imageButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    imageText: {
      paddingTop: 2,
      color: theme.primary,
    },
    stars: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    },
    chip: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
    },
    chipText: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
  });
