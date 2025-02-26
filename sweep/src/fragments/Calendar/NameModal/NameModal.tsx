import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { VerticalDivider } from "@components/Dividers";
import { useCalendar } from "@contexts/calendar";
import { useTheme } from "@contexts/theme";
import { alert } from "@services/alert";
import { updateCalendarInfo } from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  initialName: string;
  nameModalOpen: boolean;
  setNameModalOpen: (open: boolean) => void;
}

export function NameModal({
  initialName,
  nameModalOpen,
  setNameModalOpen,
}: Readonly<Props>) {
  const [nameInput, setNameInput] = useState<string>(initialName);

  const { reloadData } = useCalendar();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSubmit = async () => {
    const response = await updateCalendarInfo({ title: nameInput });

    if (response) {
      setNameModalOpen(false);
      reloadData();
    } else {
      alert("오류 발생", "캘린더 이름을 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <Modal visible={nameModalOpen} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <Pressable
          onPress={() => setNameModalOpen(false)}
          style={StyleSheet.absoluteFill}
          testID="close-modal"
        />
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>캘린더 이름</Text>
          <TextInput
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="캘린더 이름을 입력해주세요."
            style={styles.input}
            testID="name-input"
          />
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => setNameModalOpen(false)}
              style={styles.button}
              testID="cancel"
            >
              <Text>취소</Text>
            </TouchableOpacity>
            <VerticalDivider width={1} />
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.button}
              testID="submit"
            >
              <Text style={styles.greenText}>저장</Text>
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
    modal: {
      alignItems: "center",
      minWidth: 280,
      maxWidth: 280,
      paddingTop: 16,
      gap: 16,
      backgroundColor: theme.background,
      borderRadius: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    input: {
      minWidth: 240,
      padding: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    buttons: {
      flexDirection: "row",
      width: "100%",

      borderTopWidth: 1,
      borderColor: theme.border,
    },
    button: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 12,
    },
    greenText: {
      color: theme.primary,
      fontWeight: "bold",
    },
  });
