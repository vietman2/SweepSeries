import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { TextButton } from "@components/Buttons";
import { ErrorPage, LoadingComponent } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { Scroll } from "@components/ScrollView";
import { Searchbar } from "@components/Search";
import { CalloutSmall } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { CoachSelect } from "@fragments/Coach";
import { ProgramSimple } from "@fragments/Program";
import { DateTimeHeaderDisabled } from "@fragments/Schedule";
import {
  CoachSimpleType,
  ProgramSimpleType,
  StudentSimpleType,
} from "@models/products";
import { alert } from "@services/alert";
import { createLesson } from "@services/calendar";
import {
  getCoachesByProfile,
  getProgramsByProfile,
  getStudents,
} from "@services/products";
import { ThemeColorType } from "@themes/colors";
import { formatMobileNumber } from "@utils/formatters";

export function AddLesson() {
  const [coaches, setCoaches] = useState<CoachSimpleType[]>([]);
  const [programs, setPrograms] = useState<ProgramSimpleType[]>([]);
  const [students, setStudents] = useState<StudentSimpleType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [directInput, setDirectInput] = useState<boolean>(false);

  const [selectedProgram, setSelectedProgram] =
    useState<ProgramSimpleType | null>(null);
  const [selectedCoaches, setSelectedCoaches] = useState<CoachSimpleType[]>([]);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentSimpleType | null>(null);
  const [nameInput, setNameInput] = useState<string>("");
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [selectedStartDateTime, setSelectedStartDateTime] = useState<Date>(
    new Date()
  );

  const [isReady, setIsReady] = useState<boolean>(false);

  const { selectedProfile, mode } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const toggleDirectInput = () => setDirectInput((prev) => !prev);

  const handleNumberChange = (text: string) => {
    const formattedText = formatMobileNumber(text);
    setPhoneInput(formattedText);
  };

  const handleCoachPress = (coach: CoachSimpleType) => {
    setSelectedCoaches((prev) =>
      prev.includes(coach)
        ? prev.filter((selectedCoach) => selectedCoach.uuid !== coach.uuid)
        : [...prev, coach]
    );
  };

  const handleStudentPress = (student: StudentSimpleType) => {
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
    } else {
      setSelectedStudent(student);
      setSearchQuery("");
      setStudents([]);
    }
  };

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

  const handleSubmit = async (program: ProgramSimpleType) => {
    if (selectedCoaches.length === 0) {
      alert("오류 발생", "코치를 선택해주세요.");
      return;
    }

    if (directInput) {
      if (!nameInput || !phoneInput) {
        alert("오류 발생", "수강생 정보를 입력해주세요.");
        return;
      }

      const response = await createLesson(
        program.id,
        selectedCoaches.map((coach) => coach.uuid),
        selectedStartDateTime,
        {
          name: nameInput,
          phone: phoneInput,
        }
      );

      if (response) {
        router.back();
      } else {
        alert("오류 발생", "일정 등록에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      if (!selectedStudent) {
        alert("오류 발생", "수강생을 선택해주세요.");
        return;
      }

      const response = await createLesson(
        program.id,
        selectedCoaches.map((coach) => coach.uuid),
        selectedStartDateTime,
        {
          phone: selectedStudent.phone_number,
        }
      );

      if (response) {
        router.back();
      } else {
        alert("오류 발생", "일정 등록에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getProgramsByProfile(selectedProfile?.id);
      const response2 = await getCoachesByProfile(selectedProfile?.id);

      if (response && response2) {
        setPrograms(response);
        setCoaches(response2);
        setIsReady(true);
      }
    };

    fetchData();
  }, [selectedProfile]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedProgram || !searchQuery) {
        return;
      }

      const response = await getStudents(
        selectedProgram.academy_uuid,
        searchQuery
      );

      if (response) {
        setStudents(response);
      }
    };

    if (directInput) {
      setSearchQuery("");
    }

    fetchStudents();
  }, [selectedProgram, searchQuery, directInput]);

  if (!isReady) {
    return <LoadingComponent />;
  }

  if (programs.length === 0 || mode !== "pro") {
    return <ErrorPage />;
  }

  return (
    <Scroll style={styles.container}>
      <Text style={styles.subtitle}>프로그램 선택</Text>
      {selectedProgram ? (
        <View style={styles.content}>
          <TouchableOpacity
            key={selectedProgram.id}
            onPress={() => setSelectedProgram(null)}
            testID={`program-${selectedProgram.id}`}
          >
            <ProgramSimple
              program={selectedProgram}
              type="check"
              color={theme.primary}
            />
          </TouchableOpacity>
          <Text style={styles.subtitle}>코치 선택</Text>
          <Scroll horizontal style={styles.horizontalScroll}>
            {coaches.map((coach) => (
              <TouchableOpacity
                key={coach.uuid}
                onPress={() => handleCoachPress(coach)}
                testID={`coach-${coach.uuid}`}
              >
                <CoachSelect
                  coach={coach}
                  selected={selectedCoaches.includes(coach)}
                />
              </TouchableOpacity>
            ))}
          </Scroll>
          <View style={styles.studentInfo}>
            <Text style={styles.subtitle}>수강생 정보</Text>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={toggleDirectInput}
              testID="toggle-mode"
            >
              <Text>직접 입력</Text>
              <AppIcon
                icon="check-circle-outline"
                size={18}
                color={directInput ? theme.primary : theme.lowEmphasis}
              />
            </TouchableOpacity>
            {directInput ? (
              <View style={styles.wrapper}>
                <Text style={styles.textInputTitle}>
                  성명
                  <Text style={styles.required}>{" *"}</Text>
                </Text>
                <TextInput
                  value={nameInput}
                  onChangeText={setNameInput}
                  placeholder="이름"
                />
                <Text style={styles.textInputTitle}>
                  휴대폰 번호
                  <Text style={styles.required}>{" *"}</Text>
                </Text>
                <TextInput
                  value={phoneInput}
                  onChangeText={handleNumberChange}
                  placeholder="전화번호"
                />
                <Text style={styles.textInputTitle}>
                  입력하신 성명/휴대폰 번호로 수강생 정보가 입력되며,
                  수강생에게도 일정이 공유될 수 있습니다.
                </Text>
              </View>
            ) : (
              <View style={styles.wrapper}>
                {selectedStudent ? (
                  <TouchableOpacity
                    onPress={() => handleStudentPress(selectedStudent)}
                    style={styles.selectedStudent}
                    testID="unselect-student"
                  >
                    <Text>{`${selectedStudent.name} (${selectedStudent.phone_number})`}</Text>
                    <AppIcon icon="close" size={16} color="red" />
                  </TouchableOpacity>
                ) : (
                  <>
                    <Searchbar
                      placeholder="이름으로 검색하세요"
                      value={searchQuery}
                      onChange={setSearchQuery}
                    />
                    {students.length > 0 && (
                      <View style={styles.menu}>
                        {students.map((student) => (
                          <TouchableOpacity
                            key={student.id}
                            onPress={() => handleStudentPress(student)}
                            style={styles.student}
                            testID={`student-${student.id}`}
                          >
                            <Text>{`${student.name} (${student.phone_number})`}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    <CalloutSmall text="수강생이 목록에 없는 경우, 직접 입력해주세요." />
                  </>
                )}
              </View>
            )}
          </View>
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
            <TextButton
              onPress={() => handleSubmit(selectedProgram)}
              text="등록하기"
            />
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          {programs.map((program) => (
            <TouchableOpacity
              key={program.id}
              onPress={() => setSelectedProgram(program)}
              testID={`program-${program.id}`}
            >
              <ProgramSimple
                program={program}
                type="check"
                color={theme.lowEmphasis}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Scroll>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    content: {
      marginTop: 16,
      gap: 16,
    },
    horizontalScroll: {
      overflow: "hidden",
    },
    checkbox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    studentInfo: {
      marginVertical: 8,
      gap: 12,
    },
    wrapper: {
      marginVertical: 4,
      gap: 4,
    },
    textInputTitle: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    required: {
      color: "red",
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
    menu: {
      marginTop: -4,
      marginBottom: 8,
      gap: 4,
      borderWidth: 1,
      borderBottomWidth: 2,
      borderColor: theme.border,
      borderRadius: 4,
    },
    student: {
      flexDirection: "row",
      padding: 12,
    },
    selectedStudent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      backgroundColor: theme.backgroundGray,
      borderRadius: 4,
    },
  });
