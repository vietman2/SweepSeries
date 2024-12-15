import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ProgramSimple } from "@fragments/Program";
import { ProgramSimpleType } from "@models/products";
import { getPrograms } from "@services/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  uuid: string;
}

export function ProgramManagement({ uuid }: Readonly<Props>) {
  const [programs, setPrograms] = useState<ProgramSimpleType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCreate = () => {
    router.push("/front/program/create");
    router.setParams({ uuid });
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPrograms(uuid);

      if (response) {
        setPrograms(response);
      } else {
        setPrograms([]);
      }
    };

    fetchData();
  }, [uuid]);

  return (
    <View style={styles.container}>
      {programs.map((program, index) => (
        <ProgramSimple key={index} program={program} />
      ))}
      <TouchableOpacity
        onPress={handleCreate}
        style={styles.button}
        testID="create"
      >
        <AppIcon icon="plus-circle" size={24} color={theme.primary} />
      </TouchableOpacity>
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
    button: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
    },
  });
