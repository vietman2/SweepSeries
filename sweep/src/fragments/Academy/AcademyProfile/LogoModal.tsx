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
import { useTheme } from "@contexts/theme";
import { alert } from "@services/alert";
import { updateLogo } from "@services/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  uuid: string;
  currentLogo: string;
}

export function LogoModal({
  modalOpen,
  setModalOpen,
  uuid,
  currentLogo,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const hideLogoModal = () => {
    setModalOpen(false);
  };

  const handleImagePicker = async () => {
    const result = await launchImageLibraryAsync({
      allowsMultipleSelection: false,
    });

    if (result.canceled) return;

    const logo = result.assets[0];

    const response = await updateLogo(uuid, logo);

    if (response) {
      hideLogoModal();
    } else {
      alert("로고 변경 실패", "로고 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Modal visible={modalOpen} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <Pressable
          onPress={hideLogoModal}
          style={StyleSheet.absoluteFill}
          testID="close"
        />
        <View style={styles.modalContainer}>
          <Text style={styles.title}>아카데미 로고 변경</Text>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>로고 이미지</Text>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={styles.horizontal}
              testID="change"
            >
              <AppIcon icon="plus" size={18} color={theme.primary} />
              <Text style={styles.modalSubtitle}>사진 변경</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logoWrapper}>
            <Image source={{ uri: currentLogo }} style={styles.modalLogo} />
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={hideLogoModal} style={styles.button}>
              <Text style={[styles.buttonText, { color: theme.lowEmphasis }]}>
                돌아가기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000060",
    },
    modalContainer: {
      alignItems: "center",
      minWidth: 240,
      maxWidth: 280,
      paddingVertical: 8,
      gap: 24,
      backgroundColor: theme.background,
      borderRadius: 16,
    },
    title: {
      paddingTop: 8,
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      width: "100%",
    },
    modalTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.primary,
    },
    modalSubtitle: {
      fontSize: 14,
      color: theme.primary,
    },
    logoWrapper: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    modalLogo: {
      width: 60,
      height: 60,
      borderRadius: 8,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    buttonWrapper: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 12,
      paddingBottom: 4,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    button: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.primary,
    },
  });
