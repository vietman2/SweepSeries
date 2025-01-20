import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import WheelPicker, {
  ValueChangedEvent,
} from "@quidone/react-native-wheel-picker";

import { Toggle } from "@components/Buttons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  initialData: {
    useRepeat: boolean;
    repeatPeriod: number;
    repeatBreak: string;
  };
  toggleRepeatModal: () => void;
  handleUpdateRepeat: (
    useRepeat: boolean,
    repeatPeriod: number,
    repeatBreak: string
  ) => void;
}

const periodOptions = ["매일", "매주", "매월", "매년"];
const repeatBreakOptions = [
  {
    value: 5,
    label: "5회",
  },
  {
    value: 10,
    label: "10회",
  },
  {
    value: 15,
    label: "15회",
  },
  {
    value: 20,
    label: "20회",
  },
  {
    value: 25,
    label: "25회",
  },
  {
    value: 30,
    label: "30회",
  },
];

export function RepeatModal({
  initialData,
  toggleRepeatModal,
  handleUpdateRepeat,
}: Readonly<Props>) {
  const [useRepeat, setUseRepeat] = useState<boolean>(initialData.useRepeat);
  const [breakType, setBreakType] = useState<"count" | "until">("count");
  const [selectedCount, setSelectedCount] = useState<number>(5);
  const [selectedUntil, setSelectedUntil] = useState<Date>(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<number>(-1);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const toggleUseRepeat = () => {
    if (!useRepeat) {
      setSelectedPeriod(0);
    } else {
      setSelectedPeriod(-1);
    }
    setUseRepeat((prev) => !prev);
  };

  const toggleType = (type: "count" | "until") => {
    if (breakType === "count" && type === "until") {
      setBreakType("until");
    } else if (breakType === "until" && type === "count") {
      setBreakType("count");
    }
  };

  const handleCountChange = (
    event: ValueChangedEvent<{ value: number; label: string }>
  ) => {
    setSelectedCount(event.item.value);
  };

  const handleDateTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || new Date();

    setSelectedUntil(currentDate);
  };

  const handleConfirm = () => {
    if (breakType === "count") {
      handleUpdateRepeat(useRepeat, selectedPeriod, `${selectedCount}회`);
    } else {
      const date = selectedUntil;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      handleUpdateRepeat(
        useRepeat,
        selectedPeriod,
        `${year}.${month}.${day}까지`
      );
    }
    toggleRepeatModal();
  };

  return (
    <Modal visible animationType="slide" transparent>
      <View style={styles.backdrop}>
        <Pressable
          onPress={toggleRepeatModal}
          style={StyleSheet.absoluteFill}
          testID="close-alarm-modal"
        />
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>반복 설정</Text>
          <View style={styles.alarm}>
            <Text style={styles.alarmText}>반복 사용</Text>
            <Toggle isOn={useRepeat} onToggle={toggleUseRepeat} />
          </View>
          {useRepeat && (
            <>
              <View style={styles.alarm}>
                <Text style={styles.alarmText}>반복 주기</Text>
                {periodOptions.map((option, index) => (
                  <Pressable
                    key={option}
                    onPress={() => setSelectedPeriod(index)}
                    style={[
                      styles.chip,
                      selectedPeriod === index && {
                        backgroundColor: theme.primary,
                      },
                    ]}
                    testID={`period-${index}`}
                  >
                    <Text
                      style={{
                        color:
                          selectedPeriod === index
                            ? theme.background
                            : theme.highEmphasis,
                      }}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {/* 반복 기간 설정: 1. 횟수, 2. ~까지 */}
              <View style={styles.alarm}>
                <Text style={styles.alarmText}>반복 기간</Text>
                <Pressable
                  onPress={() => toggleType("count")}
                  style={[
                    styles.chip,
                    breakType === "count" && { backgroundColor: theme.primary },
                  ]}
                  testID="count-chip"
                >
                  <Text
                    style={{
                      color:
                        breakType === "count"
                          ? theme.background
                          : theme.highEmphasis,
                    }}
                  >
                    횟수
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => toggleType("until")}
                  style={[
                    styles.chip,
                    breakType === "until" && { backgroundColor: theme.primary },
                  ]}
                  testID="until-chip"
                >
                  <Text
                    style={{
                      color:
                        breakType === "until"
                          ? theme.background
                          : theme.highEmphasis,
                    }}
                  >
                    종료 날짜
                  </Text>
                </Pressable>
              </View>
              {breakType === "count" ? (
                <View style={styles.alarm}>
                  <Text style={styles.alarmText}>반복 횟수</Text>
                  <View style={styles.wrapper}>
                    <WheelPicker
                      value={selectedCount}
                      onValueChanged={handleCountChange}
                      data={repeatBreakOptions}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.alarm}>
                  <Text style={styles.alarmText}>종료 날짜</Text>
                  <View style={styles.wrapper}>
                    <DateTimePicker
                      mode="date"
                      value={selectedUntil}
                      onChange={handleDateTimeChange}
                      display={Platform.OS === "ios" ? "compact" : "default"}
                      locale="ko-KR"
                      textColor="#000"
                    />
                  </View>
                </View>
              )}
            </>
          )}
          <View style={styles.buttons}>
            <Pressable
              style={styles.cancelButton}
              onPress={toggleRepeatModal}
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
      width: "80%",
      backgroundColor: "white",
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
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      gap: 8,
    },
    alarmText: {
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
    chip: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: "transparent",
    },
    wrapper: {
      flex: 1,
    },
  });
