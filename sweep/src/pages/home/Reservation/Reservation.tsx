import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { SelectDateTime, SelectTeam } from "./_components";
import { Divider } from "@components/Dividers";
import { LoadingComponent } from "@components/Fallbacks";
import { Scroll } from "@components/ScrollView";
import { useTheme } from "@contexts/theme";
import { ProgramSimple } from "@fragments/Program";
import { ProgramSimpleType, AvailableTimesType } from "@models/products";
import { alert } from "@services/alert";
import {
  getAvailableTimes,
  getProgramDetail,
  createLessonRequest,
} from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function Reservation() {
  const [program, setProgram] = useState<ProgramSimpleType>();
  const [selectedTeam, setSelectedTeam] = useState<number>(0);
  const [selectedCurriculum, setSelectedCurriculum] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<AvailableTimesType[] | null>(
    []
  );

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const toggleModal = () => setModalVisible(!modalVisible);

  const handleSubmit = async () => {
    const startDateTime = new Date(selectedDay);
    startDateTime.setHours(parseInt(selectedTime.split(":")[0]));
    startDateTime.setMinutes(parseInt(selectedTime.split(":")[1]));
    const response = await createLessonRequest(
      program?.id,
      selectedTeam,
      startDateTime,
      selectedCurriculum
    );

    if (response) {
      alert("예약 신청 성공", "예약을 신청하였습니다.");
      router.back();
    } else {
      alert("예약 신청 실패", "오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const getDateTimeString = () => {
    const dateString = new Date(selectedDay);
    const day = ["일", "월", "화", "수", "목", "금", "토"];

    // time in format "{오전/오후} hh시 mm분"
    const minutes = selectedTime.split(":")[1];
    const hours = selectedTime.split(":")[0];
    const timeString =
      Number(minutes) > 0 ? `${hours}시 ${minutes}분` : `${hours}시`;

    return `${selectedDay} (${day[dateString.getDay()]}) ${timeString}`;
  };

  useEffect(() => {
    const fetchData = async (id: string) => {
      const response = await getProgramDetail(id);

      if (response) {
        setProgram(response.program);
      }
    };

    fetchData(id);
  }, [id]);

  useEffect(() => {
    const today = new Date();

    setSelectedDay(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const fetchTimes = async () => {
      const response = await getAvailableTimes(
        program?.id,
        selectedTeam,
        selectedDay
      );

      if (response) {
        setAvailableTimes(response.times);
        if (response.times) setSelectedTime(response.times[0].time);
      }
    };

    if (selectedTeam !== 0) {
      fetchTimes();
    }
  }, [program, selectedTeam, selectedDay]);

  if (!program) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Scroll style={styles.container}>
        <View style={styles.scrollArea}>
          <ProgramSimple program={program} selected />
          {program && (
            <SelectTeam
              program={program}
              selectedTeam={selectedTeam}
              setSelectedTeam={setSelectedTeam}
            />
          )}
          {selectedTeam !== 0 && (
            <SelectDateTime
              curriculums={program.curriculums}
              selectedCurriculum={selectedCurriculum}
              setSelectedCurriculum={setSelectedCurriculum}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              availableTimes={availableTimes}
              toggleModal={toggleModal}
            />
          )}
        </View>
      </Scroll>
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.backdrop}>
          <Pressable
            onPress={toggleModal}
            style={StyleSheet.absoluteFill}
            testID="close-modal"
          />
          <View style={styles.modalContainer}>
            <View style={styles.contents}>
              <Text style={styles.headerText}>예약 요청하시겠습니까?</Text>
              <Text style={styles.infoText}>
                {`예약상품: ${program.name} / ${selectedCurriculum}회권\n`}
                {`예약일시: ${getDateTimeString()}`}
              </Text>
            </View>
            <Divider color={theme.border} />
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleModal}
                testID="cancel"
              >
                <Text style={[styles.buttonText, { color: theme.lowEmphasis }]}>
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                testID="confirm"
              >
                <Text style={styles.buttonText}>예약요청</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 16,
      backgroundColor: theme.background,
    },
    scrollArea: {
      flex: 1,
      gap: 16,
    },
    backdrop: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      width: "70%",
      minHeight: "16%",
      backgroundColor: theme.background,
      borderRadius: 8,
    },
    contents: {
      flex: 1,
      padding: 16,
      gap: 12,
    },
    headerText: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      color: theme.mediumEmphasis,
    },
    infoText: {
      fontSize: 12,
      lineHeight: 20,
      color: theme.lowEmphasis,
    },
    buttons: {
      flexDirection: "row",
      paddingVertical: 8,
    },
    button: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.primary,
    },
  });
