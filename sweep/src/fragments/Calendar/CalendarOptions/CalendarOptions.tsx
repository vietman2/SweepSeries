import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Divider, VerticalDivider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CalendarType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  calendar: CalendarType;
}

export function CalendarOptions({ calendar }: Readonly<Props>) {
  const [calendarName, setCalendarName] = useState<string>("");
  const [nameModalOpen, setNameModalOpen] = useState<boolean>(false);
  const [colorModalOpen, setColorModalOpen] = useState<boolean>(false);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setCalendarName(calendar.title);
  }, [calendar]);

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => setNameModalOpen(true)}
          testID="open-name-modal"
        >
          <Text style={styles.text}>{calendar.title}</Text>
          <AppIcon icon="chevron-right" size={14} color={theme.lowEmphasis} />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.row}
          onPress={() => setColorModalOpen(true)}
          testID="open-color-modal"
        >
          <Text style={styles.text}>캘린더 색상</Text>
          <View style={styles.horizontal}>
            <View style={[styles.fill, { backgroundColor: calendar.color }]} />
            <AppIcon icon="chevron-right" size={14} color={theme.lowEmphasis} />
          </View>
        </TouchableOpacity>
      </View>
      <Modal visible={nameModalOpen} animationType="slide" transparent>
        <View style={styles.backdrop}>
          <Pressable
            onPress={() => setNameModalOpen(false)}
            style={StyleSheet.absoluteFill}
            testID="close-name-modal"
          />
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>캘린더 이름</Text>
            <View style={styles.content}>
              <View style={styles.wrapper}>
                <TextInput
                  value={calendarName}
                  onChangeText={setCalendarName}
                />
              </View>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity
                onPress={() => setNameModalOpen(false)}
                style={styles.buttonWrapper}
                testID="cancel-name-modal"
              >
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
              <VerticalDivider width={1} />
              <TouchableOpacity
                onPress={() => setNameModalOpen(false)}
                style={styles.buttonWrapper}
                testID="confirm-name-modal"
              >
                <Text style={[styles.buttonText, { color: theme.primary }]}>
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={colorModalOpen} animationType="slide" transparent>
        <View style={styles.backdrop}>
          <Pressable
            onPress={() => setColorModalOpen(false)}
            style={StyleSheet.absoluteFill}
            testID="close-color-modal"
          />
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>캘린더 색상</Text>
            <Text>색상 선택</Text>
            <TouchableOpacity
              onPress={() => setColorModalOpen(false)}
              testID="cancel-color-modal"
            >
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: theme.border,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    text: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.highEmphasis,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    fill: {
      width: 30,
      height: 20,
      borderRadius: 8,
    },
    backdrop: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000060",
    },
    modal: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 36,
      paddingTop: 8,
      backgroundColor: theme.background,
      borderRadius: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    content: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    wrapper: {
      flex: 1,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      paddingVertical: 4,
      borderTopWidth: 1,
      borderColor: theme.border,
    },
    buttonWrapper: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.lowEmphasis,
    },
  });
