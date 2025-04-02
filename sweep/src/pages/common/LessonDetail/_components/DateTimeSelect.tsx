import { StyleSheet, View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import styled from "styled-components/native";

import { TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { LessonDateSelector, TimeSelector } from "@fragments/DateTimeSelector";
import { AvailableTimesType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  availableTimes: AvailableTimesType[] | null;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  onConfirm: () => void;
}

export function DateTimeSelect({
  availableTimes,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onConfirm,
}: Readonly<Props>) {
  return (
    <BottomSheetScrollView style={styles.sheet}>
      <Subtitle>예약 가능 일정</Subtitle>
      <LessonDateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <Divider bold />
      <TimeSelector
        options={availableTimes}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
      <View style={styles.sheetButton}>
        <View style={styles.button}>
          <TextButton text="예약하기" onPress={onConfirm} />
        </View>
      </View>
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sheetButton: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  button: {
    flex: 1,
  },
});

const Subtitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }: { theme: ThemeColorType }) => theme.primary};
`;
