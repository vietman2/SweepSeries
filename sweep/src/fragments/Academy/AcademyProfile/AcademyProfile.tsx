import { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { AppIcon } from "@components/Icons";
import { SimpleModal } from "@components/Modals";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AcademyDetailType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

const { width } = Dimensions.get("window");

interface Props {
  academy: AcademyDetailType;
  pro?: boolean;
}

export function AcademyProfile({ academy, pro }: Readonly<Props>) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const hideModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const editProfileImage = async () => {
    hideModal();
  };

  return (
    <>
      <View style={styles.container} pointerEvents={pro ? "box-none" : "none"}>
        <View style={styles.wrapper}>
          {pro && (
            <TouchableOpacity
              style={styles.button}
              onPress={openModal}
              testID="open-modal"
            >
              <AppIcon icon="images" size={20} color="white" />
              <Text style={styles.buttonText}>대표 사진 변경</Text>
            </TouchableOpacity>
          )}
          {academy.images.length > 0 ? (
            <Image
              source={{ uri: academy.images[0] }}
              style={styles.image}
            />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </View>
        <View style={styles.header}>
          <View style={styles.titleWrapper}>
            <Image src={academy.logo} style={styles.logo} />
            <Text style={styles.title}>{academy.name}</Text>
          </View>
          <View style={styles.horizontal}>
            <AppIcon icon="location" size={20} color={theme.lowEmphasis} />
            <Text style={styles.infoText}>
              {academy.address}
            </Text>
          </View>
          <View style={styles.horizontal}>
            <AppIcon icon="star" size={20} color="#F2B517" />
            <Text style={styles.infoText}>{academy.rating} ({academy.num_reviews})</Text>
          </View>
        </View>
      </View>
      <SimpleModal
        title="아카데미 로고 변경"
        buttonText="저장하기"
        visible={modalVisible}
        hideModal={hideModal}
        onButtonPress={editProfileImage}
      >
        <View />
      </SimpleModal>
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
      position: "absolute",
      right: 8,
      bottom: 8,
      borderRadius: 8,
      backgroundColor: "#00000050",
      zIndex: 200,
    },
    buttonText: {
      color: "white",
    },
    image: {
      flex: 1,
      width,
      height: (width * 9) / 16,
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
  });
