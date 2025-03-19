import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ErrorPage } from "@components/Fallbacks";
import { Scroll } from "@components/ScrollView";
import { useCalendar } from "@contexts/calendar";
import { useTheme } from "@contexts/theme";
import { LessonRequestSimple } from "@fragments/Lesson";
import { LessonRequestType } from "@models/calendar";
import { alert } from "@services/alert";
import {
  acceptRequests,
  getLessonRequests,
  rejectRequests,
} from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

export function ReservationRequests() {
  const [requests, setRequests] = useState<LessonRequestType[]>([]);
  const [checkedRequests, setCheckedRequests] = useState<number[]>([]);

  const { selectedCalendar } = useCalendar();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCheck = (id: number) => {
    if (checkedRequests.includes(id)) {
      setCheckedRequests(
        checkedRequests.filter((checkedId) => checkedId !== id)
      );
    } else {
      setCheckedRequests([...checkedRequests, id]);
    }
  };

  const handleAccept = async () => {
    if (checkedRequests.length === 0) {
      alert("오류 발생", "승인할 예약을 1개 이상 선택해주세요.");
      return;
    }

    const response = await acceptRequests(checkedRequests, selectedCalendar?.uuid);

    if (response) {
      setRequests(
        requests.filter((request) => !checkedRequests.includes(request.id))
      );
      setCheckedRequests([]);
    } else {
      alert("오류 발생", "예약 승인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleReject = async () => {
    if (checkedRequests.length === 0) {
      alert("오류 발생", "거절할 예약을 1개 이상 선택해주세요.");
      return;
    }

    const response = await rejectRequests(
      checkedRequests,
      selectedCalendar?.uuid
    );

    if (response) {
      setRequests(
        requests.filter((request) => !checkedRequests.includes(request.id))
      );
      setCheckedRequests([]);
    } else {
      alert("오류 발생", "예약 거절에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    if (!selectedCalendar || selectedCalendar.type !== "academy") {
      return;
    }

    const fetchData = async () => {
      const response = await getLessonRequests(selectedCalendar?.uuid);

      if (response) {
        setRequests(response);
      }
    };

    fetchData();
  }, [selectedCalendar]);

  if (!selectedCalendar || selectedCalendar.type !== "academy") {
    return <ErrorPage />;
  }

  return (
    <View style={styles.container}>
      <Scroll>
        <Text style={styles.title}>
          예약 승인 요청이{" "}
          <Text style={styles.greenText}>{requests.length}</Text> 건 있습니다.
        </Text>
        <View style={styles.list}>
          {requests.map((request) => (
            <LessonRequestSimple
              key={request.id}
              lessonRequest={request}
              checked={checkedRequests.includes(request.id)}
              onCheck={() => handleCheck(request.id)}
            />
          ))}
        </View>
      </Scroll>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleAccept}
          testID="accept"
        >
          <Text style={styles.buttonText}>예약 승인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.background }]}
          onPress={handleReject}
          testID="reject"
        >
          <Text style={[styles.buttonText, { color: "#FF4040" }]}>
            예약 거절
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    title: {
      marginBottom: 16,
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    greenText: {
      color: theme.primary,
    },
    list: {
      paddingVertical: 8,
      gap: 12,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      gap: 8,
      backgroundColor: theme.background,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 4,
      backgroundColor: theme.primary,
      shadowColor: theme.highEmphasis,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.background,
    },
  });
