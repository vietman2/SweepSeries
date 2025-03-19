import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { TextButton } from "@components/Buttons";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { Searchbar } from "@components/Search";
import { CalloutSmall } from "@components/Texts";
import { useAddLesson } from "@contexts/addlesson";
import { useTheme } from "@contexts/theme";
import { StudentSimpleType } from "@models/products";
import { alert } from "@services/alert";
import { searchPerson } from "@services/auth";
import { getStudents } from "@services/products";
import { ThemeColorType } from "@themes/colors";
import { formatMobileNumber } from "@utils/formatters";

export function StudentSelector() {
  const [nameInput, setNameInput] = useState<string>("");
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [directInput, setDirectInput] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [students, setStudents] = useState<StudentSimpleType[]>([]);

  const { selectedProgram, selectedStudent, setStudent, setStudentTemp } =
    useAddLesson();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const toggleDirectInput = () => setDirectInput((prev) => !prev);

  const handleNumberChange = (text: string) => {
    const formattedText = formatMobileNumber(text);
    setPhoneInput(formattedText);
  };

  const handleStudentPress = (student: StudentSimpleType | null) => {
    setStudent(student);
    setSearchQuery("");
    setStudents([]);
  };

  const handleSearch = async () => {
    const response = await searchPerson(phoneInput);

    if (response === "NOT_FOUND") {
      // 1. DB에 전화번호가 없는 경우. context에 임시로 저장해놨다가, submit할 때 백엔드에서 저장한다.
      setStudentTemp(nameInput, phoneInput);
    } else if (response) {
      // 2. DB에 전화번호가 있는 경우. context에 저장한다.
      setStudent(response);
    } else {
      alert(
        "오류",
        "수강생 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedProgram || !searchQuery) {
        return;
      }

      const response = await getStudents(
        selectedProgram.academy_uuid,
        "academy",
        searchQuery
      );

      if (response) {
        setStudents(response);
      }
    };

    fetchStudents();
  }, [selectedProgram, searchQuery]);

  if (!selectedProgram) return null;

  if (selectedStudent) {
    return (
      <View style={styles.studentInfo}>
        <Text style={styles.subtitle}>수강생 정보</Text>
        <View style={styles.wrapper}>
          <TouchableOpacity
            onPress={() => handleStudentPress(null)}
            style={styles.selectedStudent}
            testID="unselect-student"
          >
            <Text>{`${selectedStudent.name} (${selectedStudent.phone})`}</Text>
            <AppIcon icon="close" size={16} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.studentInfo}>
      <Text style={styles.subtitle}>수강생 정보</Text>
      <TouchableOpacity
        style={styles.row}
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
            입력하신 성명/휴대폰 번호로 수강생 정보가 입력되며, 수강생에게도
            일정이 공유될 수 있습니다.
          </Text>
          <TextButton text="검색하기" onPress={handleSearch} />
        </View>
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
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
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
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
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
