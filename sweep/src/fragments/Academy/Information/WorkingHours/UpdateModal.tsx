import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { AppIcon } from "@components/Icons";
import { SimpleModal } from "@components/Modals";
import { useTheme } from "@contexts/theme";
import { ScheduleDetailType, WorkingHoursType } from "@models/products";
import { alert } from "@services/alert";
import { updateBusinessHours } from "@services/products";
import { ThemeColorType } from "@themes/colors";
import { formatTime } from "@utils/formatters";

interface ModalProps {
  schedule: WorkingHoursType[];
  initialSchedule: ScheduleDetailType[];
  modalVisible: boolean;
  hideModal: () => void;
  onRefresh?: () => void;
}

export function UpdateModal({
  schedule,
  initialSchedule,
  modalVisible,
  hideModal,
  onRefresh,
}: Readonly<ModalProps>) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isEveryday, setIsEveryday] = useState<boolean>(true);
  const [isAllWeekdays, setIsAllWeekdays] = useState<boolean>(true);
  const [isAllWeekends, setIsAllWeekends] = useState<boolean>(true);
  const [scheduleInputs, setScheduleInputs] =
    useState<ScheduleDetailType[]>(initialSchedule);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const toggleEveryday = () => {
    setIsEveryday((prev) => !prev);
  };

  const toggleAllWeekdays = () => {
    setIsAllWeekdays((prev) => !prev);
  };

  const toggleAllWeekends = () => {
    setIsAllWeekends((prev) => !prev);
  };

  const toggleClosed = (index: number) => {
    setScheduleInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index].is_closed = !newInputs[index].is_closed;

      return newInputs;
    });
  };

  const toggleAllday = (index: number) => {
    setScheduleInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index].is_allday = !newInputs[index].is_allday;

      return newInputs;
    });
  };

  const editOpenTime = (index: number, time: string) => {
    const newTime = formatTime(time);
    setScheduleInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index].open_time = newTime;

      return newInputs;
    });
  };

  const editCloseTime = (index: number, time: string) => {
    const newTime = formatTime(time);
    setScheduleInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index].close_time = newTime;

      return newInputs;
    });
  };

  const editWorkingHours = async () => {
    const response = await updateBusinessHours(
      id,
      scheduleInputs,
      isEveryday,
      isAllWeekdays,
      isAllWeekends
    );

    if (response) {
      hideModal();
      if (onRefresh) {
        onRefresh();
      }
    } else {
      alert("수정 실패", "오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    // Initial Schedule Inputs
    const days = schedule.map((schedule) => schedule.day);

    if (days.includes("매일")) {
      setIsEveryday(true);
      setIsAllWeekdays(true);
      setIsAllWeekends(true);
    } else {
      setIsEveryday(false);
    }

    if (days.includes("평일")) {
      setIsAllWeekdays(true);
    }

    if (days.includes("주말")) {
      setIsAllWeekends(true);
    }
  }, []);

  return (
    <SimpleModal
      title="운영시간"
      buttonText="저장"
      visible={modalVisible}
      hideModal={hideModal}
      onButtonPress={editWorkingHours}
      large
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>운영시간 설정</Text>
        <View style={styles.modalRow}>
          <View style={styles.normal}>
            <Text style={styles.normalText}>요일</Text>
          </View>
          <View style={styles.wide}>
            <Text style={styles.wideText}>운영시간</Text>
          </View>
          <View style={styles.normal}>
            <Text style={styles.normalText}>휴무</Text>
          </View>
          <View style={styles.normal}>
            <Text style={styles.normalText}>24시간</Text>
          </View>
        </View>
        <View style={styles.modalRow}>
          <TouchableOpacity
            onPress={toggleEveryday}
            style={styles.normal}
            testID="everyday"
          >
            <Text>매일</Text>
            <AppIcon
              icon={isEveryday ? "chevron-down" : "chevron-up"}
              size={12}
              color={theme.mediumEmphasis}
            />
          </TouchableOpacity>
          {isEveryday ? (
            <InputRow
              index={0}
              schedule={scheduleInputs[0]}
              setOpentime={editOpenTime}
              setCloseTime={editCloseTime}
              toggleClosed={toggleClosed}
              toggleAllday={toggleAllday}
            />
          ) : (
            <View style={styles.empty} />
          )}
        </View>
        {!isEveryday && (
          <>
            <View style={styles.modalRow}>
              <TouchableOpacity
                onPress={toggleAllWeekdays}
                style={styles.normal}
                testID="weekdays"
              >
                <Text>평일</Text>
                <AppIcon
                  icon={isAllWeekdays ? "chevron-down" : "chevron-up"}
                  size={12}
                  color={theme.mediumEmphasis}
                />
              </TouchableOpacity>
              {isAllWeekdays ? (
                <InputRow
                  index={0}
                  schedule={scheduleInputs[0]}
                  setOpentime={editOpenTime}
                  setCloseTime={editCloseTime}
                  toggleClosed={toggleClosed}
                  toggleAllday={toggleAllday}
                />
              ) : (
                <View style={styles.empty} />
              )}
            </View>
            {!isAllWeekdays && (
              <>
                <View style={styles.modalRow}>
                  <View style={styles.normal}>
                    <Text>월요일</Text>
                  </View>
                  <InputRow
                    index={0}
                    schedule={scheduleInputs[0]}
                    setOpentime={editOpenTime}
                    setCloseTime={editCloseTime}
                    toggleClosed={toggleClosed}
                    toggleAllday={toggleAllday}
                  />
                </View>
                <View style={styles.modalRow}>
                  <View style={styles.normal}>
                    <Text>화요일</Text>
                  </View>
                  <InputRow
                    index={1}
                    schedule={scheduleInputs[1]}
                    setOpentime={editOpenTime}
                    setCloseTime={editCloseTime}
                    toggleClosed={toggleClosed}
                    toggleAllday={toggleAllday}
                  />
                </View>
                <View style={styles.modalRow}>
                  <View style={styles.normal}>
                    <Text>수요일</Text>
                  </View>
                  <InputRow
                    index={2}
                    schedule={scheduleInputs[2]}
                    setOpentime={editOpenTime}
                    setCloseTime={editCloseTime}
                    toggleClosed={toggleClosed}
                    toggleAllday={toggleAllday}
                  />
                </View>
                <View style={styles.modalRow}>
                  <View style={styles.normal}>
                    <Text>목요일</Text>
                  </View>
                  <InputRow
                    index={3}
                    schedule={scheduleInputs[3]}
                    setOpentime={editOpenTime}
                    setCloseTime={editCloseTime}
                    toggleClosed={toggleClosed}
                    toggleAllday={toggleAllday}
                  />
                </View>
                <View style={styles.modalRow}>
                  <View style={styles.normal}>
                    <Text>금요일</Text>
                  </View>
                  <InputRow
                    index={4}
                    schedule={scheduleInputs[4]}
                    setOpentime={editOpenTime}
                    setCloseTime={editCloseTime}
                    toggleClosed={toggleClosed}
                    toggleAllday={toggleAllday}
                  />
                </View>
              </>
            )}
            <View style={styles.modalRow}>
              <TouchableOpacity
                onPress={toggleAllWeekends}
                style={styles.normal}
                testID="weekends"
              >
                <Text>주말</Text>
                <AppIcon
                  icon={isAllWeekends ? "chevron-down" : "chevron-up"}
                  size={12}
                  color={theme.mediumEmphasis}
                />
              </TouchableOpacity>
              {isAllWeekends ? (
                <InputRow
                  index={5}
                  schedule={scheduleInputs[5]}
                  setOpentime={editOpenTime}
                  setCloseTime={editCloseTime}
                  toggleClosed={toggleClosed}
                  toggleAllday={toggleAllday}
                />
              ) : (
                <View style={styles.empty} />
              )}
            </View>
            {!isAllWeekends && (
              <>
                <View style={styles.modalRow}>
                  <View style={styles.normal}>
                    <Text>토요일</Text>
                  </View>
                  <InputRow
                    index={5}
                    schedule={scheduleInputs[5]}
                    setOpentime={editOpenTime}
                    setCloseTime={editCloseTime}
                    toggleClosed={toggleClosed}
                    toggleAllday={toggleAllday}
                  />
                </View>
                <View style={styles.modalRow}>
                  <View style={styles.normal}>
                    <Text>일요일</Text>
                  </View>
                  <InputRow
                    index={6}
                    schedule={scheduleInputs[6]}
                    setOpentime={editOpenTime}
                    setCloseTime={editCloseTime}
                    toggleClosed={toggleClosed}
                    toggleAllday={toggleAllday}
                  />
                </View>
              </>
            )}
          </>
        )}
      </View>
    </SimpleModal>
  );
}

interface InputProps {
  index: number;
  schedule: ScheduleDetailType;
  setOpentime: (index: number, time: string) => void;
  setCloseTime: (index: number, time: string) => void;
  toggleClosed: (index: number) => void;
  toggleAllday: (index: number) => void;
}

function InputRow({
  index,
  schedule,
  setOpentime,
  setCloseTime,
  toggleClosed,
  toggleAllday,
}: Readonly<InputProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <View style={styles.wide}>
        <TextInput
          style={
            !schedule.is_allday && !schedule.is_closed
              ? styles.input
              : styles.disabledInput
          }
          value={schedule.open_time}
          onChangeText={(text) => setOpentime(index, text)}
          editable={!schedule.is_allday && !schedule.is_closed}
          keyboardType="numeric"
          testID="openTime"
        />
        <Text> ~ </Text>
        <TextInput
          style={
            !schedule.is_allday && !schedule.is_closed
              ? styles.input
              : styles.disabledInput
          }
          value={schedule.close_time}
          onChangeText={(text) => setCloseTime(index, text)}
          editable={!schedule.is_allday && !schedule.is_closed}
          keyboardType="numeric"
          testID="closeTime"
        />
      </View>
      <TouchableOpacity
        style={styles.normal}
        onPress={() => toggleClosed(index)}
        testID="toggleClosed"
      >
        <AppIcon
          icon="check-circle"
          size={18}
          color={schedule.is_closed ? theme.primary : theme.lowEmphasis}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.normal}
        onPress={() => toggleAllday(index)}
        testID="toggleAllday"
      >
        <AppIcon
          icon="check-circle"
          size={18}
          color={schedule.is_allday ? theme.primary : theme.lowEmphasis}
        />
      </TouchableOpacity>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    modalContainer: {
      padding: 16,
      gap: 8,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    modalRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    normal: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    normalText: {
      textAlign: "center",
      color: theme.mediumEmphasis,
    },
    wide: {
      flex: 3,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    wideText: {
      textAlign: "center",
      color: theme.mediumEmphasis,
    },
    empty: {
      flex: 5,
    },
    input: {
      padding: 4,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 4,
    },
    disabledInput: {
      padding: 4,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 4,
      color: theme.lowEmphasis,
    },
  });
