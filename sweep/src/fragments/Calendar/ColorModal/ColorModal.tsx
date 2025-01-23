import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

const colorOptions = [
  "#FF6B6B",
  "#FFA07A",
  "#98FB98",
  "#B0E0E6",
  "#FFD700",
  "#E6E6FA",
  "#87CEEB",
  "#D8BFD8",
];

interface Props {
  colorModalOpen: boolean;
  setColorModalOpen: (open: boolean) => void;
  selectedColor: string;
  handleUpdateColor: (color: string) => void;
}

export function ColorModal({
  colorModalOpen,
  setColorModalOpen,
  selectedColor,
  handleUpdateColor,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <Modal visible={colorModalOpen} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <Pressable
          onPress={() => setColorModalOpen(false)}
          style={StyleSheet.absoluteFill}
          testID="close-color-modal"
        />
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>색상을 선택해주세요.</Text>
          <View style={styles.colors}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => handleUpdateColor(color)}
                testID={`select-color-${color}`}
              >
                <View style={[styles.color, { backgroundColor: color }]}>
                  {selectedColor === color && (
                    <AppIcon icon="check" size={20} color={theme.background} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
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
    modal: {
      alignItems: "center",
      maxWidth: 280,
      paddingHorizontal: 32,
      paddingTop: 16,
      paddingBottom: 24,
      gap: 16,
      backgroundColor: theme.background,
      borderRadius: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    colors: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 16,
    },
    color: {
      justifyContent: "center",
      alignItems: "center",
      width: 40,
      height: 40,
      borderRadius: 5,
    },
  });
