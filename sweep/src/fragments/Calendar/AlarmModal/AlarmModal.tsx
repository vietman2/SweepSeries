import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import WheelPicker, {
  ValueChangedEvent,
} from "@quidone/react-native-wheel-picker";

import { Toggle } from "@components/Buttons";
import { useCalendar } from "@contexts/calendar";
import { useTheme } from "@contexts/theme";
import { alert } from "@services/alert";
import { ThemeColorType } from "@themes/colors";

interface Props {
  initialData: {
    useAlarm: boolean;
    delta: number;
    unit: number;
  };
  setAlarmModalOpen: (open: boolean) => void;
  handleUpdateAlarm: (useAlarm: boolean, delta: number, unit: number) => void;
}

const unitOptions = [
  {
    value: 0,
    label: "분 전",
  },
  {
    value: 1,
    label: "시간 전",
  },
  {
    value: 2,
    label: "일 전",
  },
  {
    value: 3,
    label: "주 전",
  },
];

export function AlarmModal({
  initialData,
  setAlarmModalOpen,
  handleUpdateAlarm,
}: Readonly<Props>) {
  const [useAlarm, setUseAlarm] = useState<boolean>(initialData.useAlarm);
  const [delta, setDelta] = useState<number>(initialData.delta);
  const [unit, setUnit] = useState<number>(initialData.unit);

  const { selectedCalendar } = useCalendar();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const toggleAlarm = () => {
    if (!selectedCalendar?.notifications && !useAlarm) {
      alert("알림 설정 오류", "캘린더의 알림을 먼저 허용해주세요.");
    } else {
      setUseAlarm((prev) => !prev);
    }
  };

  const handleDeltaChange = (
    event: ValueChangedEvent<{ value: number; label: string }>
  ) => {
    setDelta(event.item.value);
  };

  const handleUnitChange = (
    event: ValueChangedEvent<{ value: number; label: string }>
  ) => {
    setUnit(event.item.value);
  };

  const handleConfirm = () => {
    handleUpdateAlarm(useAlarm, delta, unit);
    setAlarmModalOpen(false);
  };

  return (
    <Modal visible animationType="slide" transparent>
      <View style={styles.backdrop}>
        <Pressable
          onPress={() => setAlarmModalOpen(false)}
          style={StyleSheet.absoluteFill}
          testID="close-alarm-modal"
        />
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>알람 설정</Text>
          <View style={styles.alarm}>
            <Text style={styles.alarmText}>알람 사용</Text>
            <Toggle isOn={useAlarm} onToggle={toggleAlarm} />
          </View>
          {useAlarm && (
            <View style={styles.alarm}>
              <WheelPicker
                value={delta}
                data={[
                  ...Array.from({ length: 60 }, (_, i) => {
                    return { value: i, label: `${i}` };
                  }),
                ]}
                onValueChanged={handleDeltaChange}
              />
              <WheelPicker
                value={unit}
                data={unitOptions}
                onValueChanged={handleUnitChange}
              />
            </View>
          )}
          <View style={styles.buttons}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setAlarmModalOpen(false)}
              testID="cancel-alarm"
            >
              <Text>취소</Text>
            </Pressable>
            <Pressable
              style={styles.confirmButton}
              onPress={handleConfirm}
              testID="confirm-alarm"
            >
              <Text style={styles.confirmText}>확인</Text>
            </Pressable>
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
      width: 300,
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 8,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 16,
    },
    alarm: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      marginBottom: 16,
    },
    alarmText: {
      flex: 1,
      fontSize: 16,
    },
    buttons: {
      flexDirection: "row",
      gap: 16,
    },
    cancelButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.border,
      padding: 8,
      borderRadius: 8,
    },
    confirmButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      padding: 8,
      borderRadius: 8,
    },
    confirmText: {
      color: theme.background,
      fontWeight: "bold",
    },
  });
