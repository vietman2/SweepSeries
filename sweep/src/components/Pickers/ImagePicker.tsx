import { Dispatch, SetStateAction } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  launchImageLibraryAsync,
  ImagePickerAsset,
  MediaTypeOptions,
  ImagePickerSuccessResult,
} from "expo-image-picker";
import { SvgCssUri } from "react-native-svg/css";

import { ImagePreview } from "@components/Images";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  uploadedImages: ImagePickerAsset[];
  setUploadedImages: Dispatch<SetStateAction<ImagePickerAsset[]>>;
  maxImages?: number;
  description?: string;
  imageOnly?: boolean;
}

export function ImagePicker({
  uploadedImages,
  setUploadedImages,
  maxImages = 10,
  description,
  imageOnly = false,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const uploadImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: imageOnly ? MediaTypeOptions.Images : MediaTypeOptions.All,
      allowsMultipleSelection: true,
      selectionLimit: maxImages - uploadedImages.length,
    });

    if (result.canceled) return;

    const images = result as ImagePickerSuccessResult;
    for (const imageAsset of images.assets) {
      if (uploadedImages.some((img) => img.fileName === imageAsset.fileName)) {
        // if same image is already uploaded, skip
        continue;
      }
      setUploadedImages((prev) => [...prev, imageAsset]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        {uploadedImages.map((image) => (
          <ImagePreview
            key={image.assetId}
            uri={image.uri}
            removeImage={() => removeImage(uploadedImages.indexOf(image))}
            size={100}
          />
        ))}
        {uploadedImages.length >= maxImages ? null : (
          <TouchableOpacity
            onPress={uploadImage}
            style={styles.image}
            testID="imagePicker"
          >
            <SvgCssUri
              uri={
                "https://kr.object.ncloudstorage.com/catchb.resources/appicons/upload-icon.svg"
              }
              width={40}
              height={40}
            />
          </TouchableOpacity>
        )}
      </ScrollView>
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      marginVertical: 4,
    },
    image: {
      justifyContent: "center",
      alignItems: "center",
      width: 100,
      height: 100,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: theme.border,
    },
    description: {
      color: theme.lowEmphasis,
      marginBottom: 8,
      lineHeight: 20,
    },
  });
