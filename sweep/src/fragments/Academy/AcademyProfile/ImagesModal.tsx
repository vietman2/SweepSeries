import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibraryAsync } from "expo-image-picker";

import { AppIcon } from "@components/Icons";
import { GSScroll } from "@components/ScrollView";
import { useTheme } from "@contexts/theme";
import { ImageType } from "@models/app";
import { alert } from "@services/alert";
import { deleteImage, uploadImage } from "@services/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  uuid: string;
  currentImages: ImageType[];
  refresh: () => void;
}

export function ImagesModal({
  modalOpen,
  setModalOpen,
  uuid,
  currentImages,
  refresh,
}: Readonly<Props>) {
  const [images, setImages] = useState<ImageType[]>(currentImages);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const hideImagesModal = () => {
    setModalOpen(false);
    refresh();
  };

  const handleImagePicker = async () => {
    const result = await launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 10 - currentImages.length,
    });

    if (result.canceled) return;

    const uploadedImages = result.assets;

    const response = await uploadImage(uuid, uploadedImages);

    if (response) {
      hideImagesModal();
    } else {
      alert("업로드 실패", "이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleImageDelete = async (id: number) => {
    const response = await deleteImage(uuid, id);

    if (response) {
      setImages(images.filter((image) => image.id !== id));
    } else {
      alert("삭제 실패", "이미지 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Modal visible={modalOpen} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <Pressable onPress={hideImagesModal} style={StyleSheet.absoluteFill} />
        <View style={styles.modal}>
          <Text style={styles.title}>대표 사진 변경</Text>
          <View style={styles.header}>
            <Text style={styles.subtitle}>대표 이미지</Text>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={styles.row}
              testID="upload"
            >
              <AppIcon icon="plus" size={18} color={theme.primary} />
              <Text style={styles.buttonText}>사진 추가</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.countText}>
            <Text style={styles.green}>{images.length}</Text>
            {" / 10"}
          </Text>
          <GSScroll horizontal style={styles.images}>
            {images.length === 0 ? (
              <Text>아직 대표 사진이 없습니다.</Text>
            ) : (
              <>
                {images.map((image) => (
                  <View style={styles.imageWrapper} key={image.id}>
                    <Image source={{ uri: image.uri }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleImageDelete(image.id)}
                      testID={`delete-${image.id}`}
                    >
                      <AppIcon icon="close" size={10} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </GSScroll>
          <TouchableOpacity onPress={hideImagesModal} style={styles.button}>
            <Text
              style={[styles.largeButtonText, { color: theme.lowEmphasis }]}
            >
              돌아가기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modal: {
      alignItems: "center",
      minWidth: 240,
      maxWidth: 280,
      paddingVertical: 8,
      gap: 8,
      backgroundColor: theme.background,
      borderRadius: 16,
    },
    title: {
      paddingTop: 8,
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 16,
      paddingHorizontal: 16,
      width: "100%",
    },
    subtitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.primary,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    buttonText: {
      fontSize: 14,
      color: theme.primary,
    },
    countText: {
      alignSelf: "flex-end",
      paddingHorizontal: 16,
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    green: {
      color: theme.primary,
    },
    images: {
      maxWidth: 240,
      maxHeight: 80,
      paddingHorizontal: 16,
      paddingVertical: 8,
      overflow: "hidden",
    },
    imageWrapper: {
      width: 60,
      height: 60,
      marginRight: 8,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 8,
      opacity: 0.6,
    },
    deleteButton: {
      position: "absolute",
      top: 2,
      right: 2,
      width: 12,
      height: 12,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "red",
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    largeButtonText: {
      flex: 1,
      paddingBottom: 4,
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      color: theme.primary,
    },
  });
