import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

import {
  ConfirmModal,
  DateTimeSelect,
  FeedbackAndNotes,
  ScheduledLesson,
} from "./_components";
import { ErrorPage, LoadingComponent } from "@components/Fallbacks";
import { SuccessAlert } from "@components/Modals";
import { useTheme } from "@contexts/theme";
import { LessonDetailType } from "@models/calendar";
import { AvailableTimesType } from "@models/products";
import { alert } from "@services/alert";
import {
  getSessionDetails,
  getSessionAvailableTimes,
  requestSessionScheduleChange,
} from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

export function LessonDetail() {
  const [lesson, setLesson] = useState<LessonDetailType>();
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<
    AvailableTimesType[] | null
  >([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { id, mode } = useLocalSearchParams<{ id: string; mode: string }>();

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const openSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const submitRequest = async () => {
    const response = await requestSessionScheduleChange(
      id,
      selectedDate,
      selectedTime
    );

    if (response) {
      setShowSuccessAlert(true);
      setModalOpen(false);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2000);
    } else {
      alert("예약 변경 요청 실패", "예약 변경 요청에 실패했습니다.\n다시 시도해주세요.");
    }
  };

  const handleRequest = () => {
    bottomSheetRef.current?.forceClose();
    setModalOpen(true);
  };

  const handleCancel = () => {
    bottomSheetRef.current?.forceClose();
    setModalOpen(false);
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  useEffect(() => {
    const today = new Date();

    setSelectedDate(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSessionDetails(id);

      if (response) {
        setLesson(response);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!lesson) return;

    const year = lesson.full_date.split("년")[0];
    const month = lesson.full_date.split("년")[1].split("월")[0];
    const day = lesson.full_date.split("월")[1].split("일")[0];

    const dateString = `${year}-${month.trim()}-${day.trim()}`;
    setSelectedDate(dateString);
  }, [lesson]);

  useEffect(() => {
    const getTimes = async () => {
      const response = await getSessionAvailableTimes(id, selectedDate);

      if (response) {
        setAvailableTimes(response.times);
        if (response.times) setSelectedTime(response.times[0].time);
      }
    };

    getTimes();
  }, [selectedDate]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!lesson) {
    return <ErrorPage />;
  }

  return (
    <>
      <View style={styles.container}>
        {lesson.done ? (
          <FeedbackAndNotes id={id} lesson={lesson} mode={mode} />
        ) : (
          <ScheduledLesson lesson={lesson} mode={mode} openSheet={openSheet} />
        )}
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["70%"]}
        backdropComponent={renderBackdrop}
      >
        <DateTimeSelect
          availableTimes={availableTimes}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onConfirm={handleRequest}
        />
      </BottomSheet>
      {modalOpen && (
        <ConfirmModal
          lesson={lesson}
          newDateTime={`${selectedDate} ${selectedTime}`}
          onConfirm={submitRequest}
          onCancel={handleCancel}
        />
      )}
      {showSuccessAlert && (
        <SuccessAlert message="예약변경 요청이 완료되었습니다." />
      )}
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 16,
      gap: 32,
      backgroundColor: theme.background,
    },
  });
