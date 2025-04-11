import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { LoadingComponent } from "@components/Fallbacks";
import { ScrollView } from "@components/ScrollView";
import { Searchbar } from "@components/Search";
import { Text } from "@components/Texts";
import { useAcademyFront, useCoachFront, useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { ProfileImage } from "@fragments/Profile";
import { ScheduleSimple } from "@fragments/Schedule";
import { LessonType } from "@models/calendar";
import { StudentSimpleType } from "@models/products";
import { getStudents } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function AcademyCustomerManagement() {
  const { activeProfile } = useFront();
  const { lessons, loading, refresh } = useAcademyFront();

  if (activeProfile.mode !== "academy") return null;

  const handleNavigate = (id: number) => {
    router.push(`/front/academy/${activeProfile.uuid}/customers/${id}`);
  };

  return (
    <Content
      academyUUID={activeProfile.uuid}
      mode="academy"
      lessons={lessons}
      navigateToDetails={handleNavigate}
      loading={loading}
      refresh={refresh}
    />
  );
}

export function CoachCustomerManagement() {
  const { activeProfile } = useFront();
  const { coach, lessons, loading, refresh } = useCoachFront();

  if (activeProfile.mode !== "coach") return null;

  const handleNavigate = (id: number) => {
    router.push(`/front/coach/${activeProfile.uuid}/customers/${id}`);
  };

  if (!coach) return <LoadingComponent />;

  return (
    <Content
      academyUUID={coach.academy_uuid}
      mode="coach"
      lessons={lessons}
      navigateToDetails={handleNavigate}
      loading={loading}
      refresh={refresh}
    />
  );
}

interface Props {
  academyUUID: string;
  mode: "academy" | "coach";
  lessons: LessonType[];
  navigateToDetails: (id: number) => void;
  loading: boolean;
  refresh: () => void;
}

function Content({
  academyUUID,
  mode,
  lessons,
  navigateToDetails,
  loading,
  refresh,
}: Readonly<Props>) {
  const [students, setStudents] = useState<StudentSimpleType[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    refresh();
    setRefreshCount((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStudents(academyUUID, mode, query);

      if (response) {
        setStudents(response);
      }

      setLoadingStudents(false);
    };

    fetchData();
  }, [academyUUID, mode, query, refreshCount]);

  return (
    <ScrollView
      refreshing={loading || loadingStudents}
      onRefresh={handleRefresh}
      style={styles.container}
    >
      <View style={styles.wrapper}>
        <Text style={styles.title}>오늘 진행한 레슨</Text>
        <View style={styles.schedules}>
          {lessons.length === 0 && (
            <Text style={styles.emptyText}>오늘 예정된 레슨이 없습니다.</Text>
          )}
          {lessons.map((lesson) => (
            <View style={styles.schedule} key={lesson.id}>
              <ScheduleSimple schedule={lesson} type="레슨" />
            </View>
          ))}
        </View>
        <View style={styles.horizontal}>
          <Text style={styles.title}>아카데미 수강생 목록</Text>
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
              onPress={() => navigateToDetails(student.id)}
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
    emptyText: {
      marginVertical: 8,
      textAlign: "center",
      fontSize: 14,
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
