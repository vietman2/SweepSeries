import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { CalendarHeader } from "@components/Calendars";
import { AppIcon } from "@components/Icons";
import { ScrollView } from "@components/ScrollView";
import { useCoachFront, useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { LessonSimple } from "@fragments/Lesson";
import { LessonType } from "@models/calendar";
import { StudentLessonsType } from "@models/products";
import { getAcademyStudentDetail } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function AcademyCustomerDetail() {
  const { activeProfile } = useFront();

  if (activeProfile.mode !== "academy") return null;

  return (
    <CustomerDetail
      UUID={activeProfile.uuid}
      academyUUID={activeProfile.uuid}
      mode="academy"
    />
  );
}

export function CoachCustomerDetail() {
  const { activeProfile } = useFront();

  if (activeProfile.mode !== "coach") return null;

  const { coach } = useCoachFront();

  if (!coach) return null;

  return (
    <CustomerDetail
      academyUUID={coach.academy_uuid}
      UUID={activeProfile.uuid}
      mode="coach"
    />
  );
}

interface Props {
  UUID: string;
  academyUUID: string;
  mode: "academy" | "coach";
}

function CustomerDetail({ UUID, academyUUID, mode }: Readonly<Props>) {
  const [student, setStudent] = useState<StudentLessonsType>();
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { studentid } = useLocalSearchParams<{ studentid: string }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const refresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const goBack = () => {
    router.back();
  };

  const navigateToLessonDetail = (lesson: LessonType) => {
    const lessonId = lesson.id.slice(1);
    const lessonDetailMode = lesson.coach_uuids.includes(UUID) ? "pro" : "";

    router.push({
      pathname: "/front/lesson/[id]",
      params: { id: lessonId, mode: lessonDetailMode },
    });
  };

  useEffect(() => {
    const getCurrentMonth = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      return `${year}-${month < 10 ? `0${month}` : month}`;
    };

    setSelectedMonth(getCurrentMonth());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAcademyStudentDetail(
        academyUUID,
        studentid,
        selectedMonth
      );

      if (response) {
        setStudent(response);
      }

      setLoading(false);
    };

    fetchData();
  }, [mode, studentid, academyUUID, selectedMonth, refreshCount]);

  if (!student) {
    return null;
  }

  return (
    <ScrollView
      refreshing={loading}
      onRefresh={refresh}
      style={styles.container}
    >
      <View style={styles.contents}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} testID="back-button">
            <AppIcon
              icon="chevron-left"
              size={24}
              color={theme.mediumEmphasis}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{student.name}님의 레슨 목록</Text>
        </View>
        <CalendarHeader
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        <View style={styles.list}>
          {student.lessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              onPress={() => navigateToLessonDetail(lesson)}
              style={styles.lesson}
              testID={`lesson-${lesson.id}`}
            >
              <LessonSimple lesson={lesson} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.background,
    },
    contents: {
      gap: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8,
      gap: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    list: {
      gap: 8,
    },
    lesson: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
