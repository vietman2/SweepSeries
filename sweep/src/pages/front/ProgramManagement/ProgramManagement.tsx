import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@components/Icons";
import { useAcademyFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { ProgramSimple } from "@fragments/Program";
import { ProgramSimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

export function ProgramManagement() {
  const { programs } = useAcademyFront();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCreate = () => {
    router.push("/front/program/create");
  };

  const handleDetail = (program: ProgramSimpleType) => {
    router.push({
      pathname: "/front/program/[id]",
      params: { id: program.id },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {programs.length === 0 && (
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No programs available</Text>
          </View>
        )}
        {programs.map((program) => (
          <TouchableOpacity
            key={program.id}
            onPress={() => handleDetail(program)}
            testID={`program-${program.id}`}
          >
            <ProgramSimple program={program} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={handleCreate}
          style={styles.button}
          testID="create"
        >
          <AppIcon icon="plus-circle" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    wrapper: {
      padding: 16,
      gap: 16,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
    },
    emptyList: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      color: theme.highEmphasis,
      fontSize: 16,
      fontWeight: "600",
    },
  });
