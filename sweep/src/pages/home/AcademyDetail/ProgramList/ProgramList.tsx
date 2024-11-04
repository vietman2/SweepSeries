import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useTheme } from "@contexts/theme";
import { ProgramSimple } from "@fragments/Program";
import { ProgramSimpleType } from "@models/products";
import { sampleAcademyPrograms } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function ProgramList() {
  const [programs, setPrograms] = useState<ProgramSimpleType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setPrograms(sampleAcademyPrograms);
  }, []);

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
