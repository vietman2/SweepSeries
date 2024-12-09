import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { AppIcon } from "@components/Icons";

interface PreviewProps {
  uri: string;
  removeImage?: () => void;
  size?: number;
}

export function ImagePreview({
  uri,
  removeImage,
  size = 120,
}: Readonly<PreviewProps>) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <ImageBackground
        source={{ uri }}
        style={{ width: size, height: size }}
        imageStyle={styles.image}
      >
        {removeImage ? (
          <TouchableOpacity
            onPress={removeImage}
            style={styles.preview}
            testID="removeImage"
          >
            <AppIcon icon="minus" size={18} color="red" />
          </TouchableOpacity>
        ) : null}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    position: "absolute",
    top: 2,
    right: 2,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  image: {
    borderRadius: 10,
  },
});
