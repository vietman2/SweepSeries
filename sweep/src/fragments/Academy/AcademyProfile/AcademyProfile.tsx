import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ImagesModal } from "./ImagesModal";
import { LogoModal } from "./LogoModal";
import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AcademyDetailType } from "@models/products";
import { likeAcademy } from "@services/products";
import { ThemeColorType } from "@themes/colors";

const { width } = Dimensions.get("window");

interface Props {
  academy: AcademyDetailType;
  pro?: boolean;
  onRefresh?: () => void;
}

export function AcademyProfile({ academy, pro, onRefresh }: Readonly<Props>) {
  const [liked, setLiked] = useState<boolean>(academy.is_liked);

  const [logoModalVisible, setLogoModalVisible] = useState<boolean>(false);
  const [imagesModalVisible, setImagesModalVisible] = useState<boolean>(false);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const openImageModal = () => {
    setImagesModalVisible(true);
  };

  const openLogoModal = () => {
    setLogoModalVisible(true);
  };

  const handleLike = async () => {
    const response = await likeAcademy(academy.uuid);

    if (response) {
      setLiked(!liked);
    }
  };

  useEffect(() => {
    if (pro && onRefresh) {
      onRefresh();
    }
  }, [logoModalVisible, imagesModalVisible]);

  return (
    <>
      <View style={styles.container} pointerEvents="box-none">
        <View style={styles.wrapper}>
          {pro && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.imagesButton]}
                onPress={openImageModal}
                testID="open-image-modal"
              >
                <AppIcon icon="images" size={20} color="white" />
                <Text style={styles.buttonText}>대표 사진 변경</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.logoButton]}
                onPress={openLogoModal}
                testID="open-logo-modal"
              >
                <AppIcon icon="images" size={20} color="white" />
                <Text style={styles.buttonText}>아카데미 로고 변경</Text>
              </TouchableOpacity>
            </>
          )}
          {academy.images.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
            >
              {academy.images.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.uri }}
                  style={styles.image}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </View>
        <View style={styles.header}>
          <View style={styles.row}>
            <View style={styles.titleWrapper}>
              <Image src={academy.logo} style={styles.logo} />
              <Text style={styles.title}>{academy.name}</Text>
            </View>
            <View style={styles.horizontal}>
              <TouchableOpacity onPress={handleLike} testID="like-button">
                <AppIcon
                  icon={liked ? "heart" : "heart-outline"}
                  size={24}
                  color={theme.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.horizontal}>
            <AppIcon icon="location" size={20} color={theme.lowEmphasis} />
            <Text style={styles.infoText}>{academy.address}</Text>
          </View>
          <View style={styles.horizontal}>
            <AppIcon icon="star" size={20} color="#F2B517" />
            <Text style={styles.infoText}>
              {academy.rating} ({academy.num_reviews})
            </Text>
          </View>
        </View>
      </View>
      <ImagesModal
        modalOpen={imagesModalVisible}
        setModalOpen={setImagesModalVisible}
        uuid={academy.uuid}
        currentImages={academy.images}
      />
      <LogoModal
        modalOpen={logoModalVisible}
        setModalOpen={setLogoModalVisible}
        uuid={academy.uuid}
        currentLogo={academy.logo}
      />
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      paddingBottom: 8,
      gap: 16,
      backgroundColor: theme.background,
    },
    wrapper: {
      position: "relative",
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 8,
      borderRadius: 8,
      backgroundColor: "#00000050",
      zIndex: 200,
    },
    imagesButton: {
      position: "absolute",
      right: 8,
      bottom: 8,
    },
    logoButton: {
      position: "absolute",
      left: 8,
      top: 8,
    },
    buttonText: {
      color: "white",
    },
    image: {
      flex: 1,
      width,
      height: (width * 9) / 16,
      resizeMode: "cover",
      zIndex: 0,
    },
    header: {
      paddingHorizontal: 16,
      gap: 4,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    infoText: {
      color: theme.lowEmphasis,
    },
    titleWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      gap: 8,
    },
    logo: {
      width: 30,
      height: 30,
      borderRadius: 4,
    },
    placeholderImage: {
      width,
      height: (width * 9) / 16,
      backgroundColor: theme.lowEmphasis,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingRight: 8,
      gap: 4,
    },
  });
