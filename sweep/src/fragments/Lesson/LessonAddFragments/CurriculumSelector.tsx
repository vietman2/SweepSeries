import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { LoadingComponent } from "@components/Fallbacks";
import { CalloutSmall } from "@components/Texts";
import { useAddLesson } from "@contexts/addlesson";
import { useTheme } from "@contexts/theme";
import { CurriculumChip } from "@fragments/Program";
import { alert } from "@services/alert";
import { getCurriculum } from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

export function CurriculumSelector() {
  // 0: 로딩중, 1: 잔여 계약 레슨 있음, 2: 잔여 계약 레슨 없음, 3: 신규
  const [status, setStatus] = useState<0 | 1 | 2 | 3>(0);
  const [remaining, setRemaining] = useState<number>(0);

  const {
    selectedProgram,
    selectedStudent,
    selectedCurriculum,
    setSelectedCurriculum,
  } = useAddLesson();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getText = () => {
    if (status === 1 && selectedCurriculum) {
      return `-  진행 중인 레슨이 있습니다. (${
        selectedCurriculum.num_lessons - remaining
      }/${selectedCurriculum?.num_lessons})`;
    }

    if (status === 2) {
      return `-  모든 레슨을 완료했습니다. 새롭게 등록이 필요합니다.`;
    }

    if (status === 3) {
      return `-  해당 프로그램을 수강한 적이 없습니다.\n-  커리큘럼을 선택하고 신규로 등록해주세요.`;
    }

    return "";
  };

  useEffect(() => {
    const fetchCurriculum = async () => {
      if (!selectedStudent || !selectedProgram) return;

      if (selectedStudent.id === -1) {
        setStatus(3);
        return;
      }

      const response = await getCurriculum(
        selectedProgram.id,
        selectedStudent.id
      );

      if (response) {
        if (response.remaining_lessons > 0) {
          setSelectedCurriculum(response.curriculum);
          setStatus(1);
          setRemaining(response.remaining_lessons);
        } else if (response.remaining_lessons === 0) {
          setStatus(2);
        } else {
          setStatus(3);
        }
      } else {
        alert("오류 발생", "커리큘럼을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchCurriculum();
  }, [selectedStudent, selectedProgram]);

  if (!selectedProgram || !selectedStudent) {
    return null;
  }

  if (status === 0) return <LoadingComponent />;

  if (status === 1) {
    return (
      <View style={styles.contents}>
        <Text style={styles.subtitle}>커리큘럼</Text>
        <CalloutSmall text={getText()} color={theme.primary} />
        <View style={styles.row}>
          <CurriculumChip curriculum={selectedCurriculum} selected />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.contents}>
      <Text style={styles.subtitle}>커리큘럼 선택</Text>
      <CalloutSmall text={getText()} color={theme.primary} />
      <View style={styles.row}>
        {selectedProgram.curriculums.map((curriculum) => (
          <TouchableOpacity
            key={curriculum.id}
            onPress={() => setSelectedCurriculum(curriculum)}
            testID={`curriculum-${curriculum.id}`}
          >
            <CurriculumChip
              curriculum={curriculum}
              selected={selectedCurriculum?.id === curriculum.id}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    contents: {
      gap: 8,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
  });
