import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { Empty } from "@components/Fallbacks";
import { useAcademyDetail } from "@contexts/academy";
import { useTheme } from "@contexts/theme";
import { ProgramSimple } from "@fragments/Program";
import { ProgramSimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

export function AcademyPrograms() {
  const { programs } = useAcademyDetail();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleReserve = (program: ProgramSimpleType) => {
    router.push({
      pathname: "/home/reserve/[id]",
      params: { id: program.id },
    });
  };

  return (
    <View style={styles.container}>
      {programs.length === 0 ? (
        <Empty message="등록된 프로그램이 없습니다." type={2} />
      ) : (
        <>
          {programs.map((program) => (
            <TouchableOpacity
              key={program.id}
              onPress={() => handleReserve(program)}
              testID={`program-${program.id}`}
            >
              <ProgramSimple program={program} />
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16,
      gap: 16,
    },
  });
