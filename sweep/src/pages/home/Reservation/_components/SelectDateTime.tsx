import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

import { TextButton } from "@components/Buttons";
import { CustomHeader } from "@components/Calendars";
import { Divider } from "@components/Dividers";
import { CalloutSmall } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AvailableTimesType, CurriculumType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  curriculums: CurriculumType[];
  selectedCurriculum: number;
  setSelectedCurriculum: (curriculumId: number) => void;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  availableTimes: AvailableTimesType[];
  toggleModal: () => void;
}

export function SelectDateTime({
  curriculums,
  selectedCurriculum,
  setSelectedCurriculum,
  selectedDay,
  setSelectedDay,
  selectedTime,
  setSelectedTime,
  availableTimes,
  toggleModal,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const dayComponent = ({ date }: { date: DateData }) => {
    const isToday = date.dateString === new Date().toISOString().split("T")[0];
    const isSelected = date.dateString === selectedDay;

    return (
      <TouchableOpacity
        style={[
          styles.dayComponent,
          isSelected
            ? {
                backgroundColor: theme.primary,
              }
            : isToday && {
                backgroundColor: theme.border,
              },
        ]}
        onPress={() => setSelectedDay(date.dateString)}
        testID={`day-${date.dateString}`}
      >
        <Text
          style={
            isSelected && {
              color: theme.background,
            }
          }
        >
          {date.day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.subtitle}>커리큘럼 선택</Text>
        <View style={styles.curriculums}>
          {curriculums.map((curriculum) => (
            <TouchableOpacity
              key={curriculum.id}
              style={[
                styles.curriculum,
                selectedCurriculum === curriculum.id && {
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => setSelectedCurriculum(curriculum.id)}
              testID={`curriculum-${curriculum.id}`}
            >
              <Text
                style={[
                  styles.lessonsText,
                  selectedCurriculum === curriculum.id && {
                    color: theme.primary,
                  },
                ]}
              >
                {curriculum.num_lessons}회권
              </Text>
              <Text
                style={[
                  styles.priceText,
                  selectedCurriculum === curriculum.id && {
                    color: theme.primary,
                  },
                ]}
              >
                {curriculum.price.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Divider color={theme.lowEmphasis} bold />
      <View style={styles.wrapper}>
        <Text style={styles.subtitle}>예약 날짜 선택</Text>
        {selectedCurriculum ? (
          <Calendar
            initialDate={new Date().toISOString().split("T")[0]}
            customHeader={CustomHeader}
            dayComponent={dayComponent}
            hideExtraDays
          />
        ) : (
          <CalloutSmall
            text="원하시는 레슨 횟수를 먼저 선택해주세요."
            align="center"
          />
        )}
      </View>
      <Divider color={theme.lowEmphasis} bold />
      <View style={styles.wrapper}>
        <Text style={styles.subtitle}>예약 시간 선택</Text>
        {selectedCurriculum > 0 && (
          <View style={styles.availableTimes}>
            {availableTimes.map((time) => (
              <View key={time.time}>
                {time.is_available ? (
                  <TouchableOpacity
                    style={[
                      styles.timeChip,
                      selectedTime === time.time && {
                        backgroundColor: theme.primary,
                        borderColor: theme.primary,
                      },
                    ]}
                    onPress={() => setSelectedTime(time.time)}
                    testID={`time-${time.time}`}
                  >
                    <Text
                      style={
                        selectedTime === time.time && {
                          color: theme.background,
                        }
                      }
                    >
                      {time.time}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.disabledChip}>
                    <Text style={styles.disabledText}>{time.time}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.buttonWrapper}>
        <TextButton text="예약하기" onPress={toggleModal} />
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      gap: 16,
    },
    wrapper: {
      gap: 8,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    curriculums: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    curriculum: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 8,
      borderWidth: 1,
      borderColor: theme.lowEmphasis,
      borderRadius: 4,
    },
    lessonsText: {
      fontSize: 14,
      color: theme.mediumEmphasis,
    },
    priceText: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.mediumEmphasis,
    },
    dayComponent: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
    },
    availableTimes: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignSelf: "center",
      rowGap: 8,
      columnGap: 16,
    },
    timeChip: {
      alignItems: "center",
      justifyContent: "center",
      width: 72,
      height: 28,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    disabledChip: {
      alignItems: "center",
      justifyContent: "center",
      width: 72,
      height: 28,
      borderRadius: 4,
      backgroundColor: theme.border,
    },
    disabledText: {
      color: theme.lowEmphasis,
    },
    buttonWrapper: {
      marginTop: 16,
      marginBottom: 48,
    },
  });
