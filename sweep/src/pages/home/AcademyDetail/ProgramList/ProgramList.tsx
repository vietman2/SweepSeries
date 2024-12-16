import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useTheme } from "@contexts/theme";
import { ProgramSimple } from "@fragments/Program";
import { ProgramSimpleType } from "@models/products";
import { getPrograms } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function ProgramList() {
  const [programs, setPrograms] = useState<ProgramSimpleType[]>([]);
  const { id } = useLocalSearchParams<{ id: string }>();

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPrograms(id);

      if (response) {
        setPrograms(response);
      } else {
        setPrograms([]);
      }
    };

    fetchData();
  }, [id]);

  return (
    <View style={styles.container}>
      {programs.map((program, index) => (
        <ProgramSimple key={index} program={program} />
      ))}
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
