import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { TextButton } from "@components/Buttons";
import { Scroll } from "@components/ScrollView";
import { useAddLesson } from "@contexts/addlesson";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { CoachSelect } from "@fragments/Coach";
import { DateTimeHeaderDisabled } from "@fragments/Schedule";
import { CoachSimpleType, ProgramSimpleType } from "@models/products";
import { getCoachesByProfile } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function OtherFields() {
  const [coaches, setCoaches] = useState<CoachSimpleType[]>([]);

  const {
    selectedProgram,
    selectedCurriculum,
    selectedCoaches,
    selectedStartDateTime,
    addCoach,
    setSelectedStartDateTime,
    handleSubmit,
  } = useAddLesson();
  const { selectedProfile } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleDateTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || new Date();
    setSelectedStartDateTime(currentDate);
  };

  const getDateTimePickerMode = () => {
    if (Platform.OS === "ios") {
      return "datetime";
    }

    return "date";
  };

  const getEndDateTime = (program: ProgramSimpleType) => {
    const endDateTime = new Date(selectedStartDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + program.duration);
    return endDateTime;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCoachesByProfile(selectedProfile?.id);

      if (response) {
        setCoaches(response);
      }
    };

    fetchData();
  }, [selectedProfile]);

  if (!selectedProgram || !selectedCurriculum) return null;

  return (
    <View style={styles.contents}>
      <Text style={styles.subtitle}>코치 선택</Text>
      <Scroll horizontal style={styles.horizontalScroll}>
        {coaches.map((coach) => (
          <TouchableOpacity
            key={coach.uuid}
            onPress={() => addCoach(coach)}
            testID={`coach-${coach.uuid}`}
          >
            <CoachSelect
              coach={coach}
              selected={selectedCoaches.includes(coach)}
            />
          </TouchableOpacity>
        ))}
      </Scroll>
      <View style={styles.wrapper}>
        <Text style={styles.subtitle}>첫 레슨 일정</Text>
        <View style={styles.dateTimeWrapper}>
          <DateTimeHeaderDisabled
            selectedStartDateTime={selectedStartDateTime}
            selectedEndDateTime={getEndDateTime(selectedProgram)}
          />
        </View>
        <View style={styles.pickerWrapper}>
          <DateTimePicker
            mode={getDateTimePickerMode()}
            value={selectedStartDateTime}
            onChange={handleDateTimeChange}
            display="spinner"
            locale="ko-KR"
            textColor="#000"
          />
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <TextButton onPress={handleSubmit} text="등록하기" />
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    horizontalScroll: {
      overflow: "hidden",
    },
    dateTimeWrapper: {
      marginHorizontal: -16,
    },
    pickerWrapper: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    buttonWrapper: {
      paddingBottom: 32,
    },
    contents: {
      gap: 8,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    wrapper: {
      marginVertical: 4,
      gap: 4,
    },
  });
