import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CoachSelect } from "../CoachSelect/CoachSelect";
import { TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { CalloutSmall } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CoachSimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  coaches: CoachSimpleType[];
  closeModal: () => void;
  addCoachTeam: (coaches: CoachSimpleType[]) => void;
}

export function CoachModal({
  coaches,
  closeModal,
  addCoachTeam,
}: Readonly<Props>) {
  const [selectedCoaches, setSelectedCoaches] = useState<CoachSimpleType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCoachSelect = (coach: CoachSimpleType) => {
    setSelectedCoaches((prev) => {
      if (prev.includes(coach)) {
        return prev.filter((item) => item.uuid !== coach.uuid);
      } else {
        return [...prev, coach];
      }
    });
  };

  const handleConfirm = () => {
    addCoachTeam(selectedCoaches);
  };

  return (
    <Modal animationType="slide" transparent visible>
      <View style={styles.backdrop}>
        <Pressable
          onPress={closeModal}
          style={StyleSheet.absoluteFill}
          testID="close-modal"
        />
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>코치 선택</Text>
            <Divider />
          </View>
          <View style={styles.list}>
            {coaches.map((coach, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleCoachSelect(coach)}
                testID={`coach-${index}`}
              >
                <CoachSelect
                  coach={coach}
                  selected={selectedCoaches.includes(coach)}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.footer}>
            <CalloutSmall
              text={
                "\u2022 코치는 한 명 또는 다수의 코치를 선택할 수 있습니다.\n\n\u2022 다수의 코치를 선택하면, 1개의 프로그램에 선택된 코치 모두가 참여하게 됩니다."
              }
              color={theme.primary}
            />
            <TextButton text="확인" onPress={handleConfirm} />
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
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
      width: 360,
      minHeight: 500,
      backgroundColor: theme.background,
      paddingVertical: 8,
      borderRadius: 8,
    },
    header: {
      gap: 4,
    },
    footer: {
      paddingHorizontal: 16,
      gap: 12,
    },
    title: {
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
    },
    list: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      paddingVertical: 24,
      paddingHorizontal: 16,
    },
  });
