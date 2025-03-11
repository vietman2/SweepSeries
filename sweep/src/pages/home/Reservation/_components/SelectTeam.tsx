import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@contexts/theme";
import { CoachTeam } from "@fragments/Program";
import { ProgramSimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  program: ProgramSimpleType;
  selectedTeam: number;
  setSelectedTeam: (teamId: number) => void;
}

export function SelectTeam({
  program,
  selectedTeam,
  setSelectedTeam,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    if (program.random_assignment) setSelectedTeam(-1);
  }, [program]);

  if (program.random_assignment) {
    // 아카데미에서 코치 임의 배정

    return (
      <View style={styles.wrapper}>
        <Text style={styles.subtitle}>레슨 팀</Text>
        <Text style={styles.subtitle}>
          해당 레슨은 아카데미에서 코치를 배정합니다.
        </Text>
      </View>
    );
  }

  if (selectedTeam > 0) {
    // 팀 선택 완료
    return (
      <View style={styles.wrapper}>
        <Text style={styles.subtitle}>레슨 팀</Text>
        <View style={styles.selectedCoachTeam}>
          <TouchableOpacity
            onPress={() => setSelectedTeam(0)}
            testID="unselect-team"
          >
            <Text style={{ color: theme.primary }}>다시 선택하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  // 팀 선택 화면
  return (
    <View style={styles.wrapper}>
      <Text style={styles.subtitle}>레슨 팀 선택하기</Text>
      {program.teams.map((team) => (
        <CoachTeam
          key={team.id}
          team={team}
          type={2}
          onPress={() => setSelectedTeam(team.id)}
        />
      ))}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    wrapper: {
      gap: 8,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    selectedCoachTeam: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
