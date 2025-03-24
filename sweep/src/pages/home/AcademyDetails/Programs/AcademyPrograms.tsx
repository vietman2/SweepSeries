import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { useAcademyDetail } from "@contexts/academy";
import { useTheme } from "@contexts/theme";
import { ProgramSimple } from "@fragments/Program";
import { ProgramSimpleType } from "@models/products";
import { getPrograms } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function AcademyPrograms() {
  const [programs, setPrograms] = useState<ProgramSimpleType[]>([]);

  const { academy } = useAcademyDetail();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleReserve = (program: ProgramSimpleType) => {
    router.push({
      pathname: "/home/reserve/[id]",
      params: { id: program.id },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!academy) return;

      const response = await getPrograms(academy.uuid);

      if (response) {
        setPrograms(response);
      } else {
        setPrograms([]);
      }
    };

    fetchData();
  }, [academy]);

  if (!academy) return null;

  return (
    <View style={styles.container}>
      {programs.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>등록된 프로그램이 없습니다.</Text>
        </View>
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
    emptyWrapper: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 100,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
  });
