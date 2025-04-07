import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { ScrollView } from "@components/ScrollView";
import { Searchbar } from "@components/Search";
import { Text } from "@components/Texts";
import { useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { ProfileImage } from "@fragments/Profile";
import { ScheduleSimple } from "@fragments/Schedule";
import { LessonType } from "@models/calendar";
import { StudentSimpleType } from "@models/products";
import { getDailyLessons } from "@services/calendar";
import { getStudents } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function CustomerManagement() {
  const [lessons, setLesson] = useState<LessonType[]>([]);
  const [students, setStudents] = useState<StudentSimpleType[]>([]);

  const [query, setQuery] = useState<string>("");
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { uuid, mode, coach } = useFront();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const navigateToDetail = (id: number) => {
    router.push({
      pathname: "/front/customer/[id]",
      params: { id },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const response1 = await getDailyLessons(
        uuid,
        new Date().toISOString().slice(0, 10),
        mode
      );
      const queryUuid = mode === "coach" ? coach?.academy_uuid : uuid;
      const response2 = await getStudents(queryUuid, mode, query);

      if (response1 && response2) {
        setLesson(response1);
        setStudents(response2);
      }
    };

    fetchData();
  }, [uuid, mode, query, refreshCount]);

  return (
    <View style={styles.container}>
      <ScrollView onRefresh={handleRefresh} refreshing={false}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>오늘 진행한 레슨</Text>
          <View style={styles.schedules}>
            {lessons.map((lesson) => (
              <View style={styles.schedule} key={lesson.id}>
                <ScheduleSimple schedule={lesson} type="레슨" />
              </View>
            ))}
          </View>
          <View style={styles.horizontal}>
            <Text style={styles.title}>수강생 목록</Text>
            <Text style={styles.subtitle}>인원 ({students.length})</Text>
          </View>
          <View style={styles.searchWrapper}>
            <Searchbar
              placeholder="이름으로 검색하세요"
              value={query}
              onChange={setQuery}
            />
          </View>
          <View style={styles.list}>
            {students.map((student) => (
              <TouchableOpacity
                style={styles.student}
                key={student.id}
                onPress={() => navigateToDetail(student.id)}
                testID={`student-${student.id}`}
              >
                <ProfileImage
                  uri={student.profile_image}
                  color={student.default_color}
                />
                <Text key={student.id}>{student.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    wrapper: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 8,
    },
    schedules: {
      marginVertical: 8,
      gap: 8,
    },
    schedule: {
      paddingVertical: 4,
      borderWidth: 0.25,
      borderColor: theme.primary,
      borderRadius: 8,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    subtitle: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    searchWrapper: {
      flexDirection: "row",
    },
    list: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 8,
    },
    student: {
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      gap: 8,
    },
  });
