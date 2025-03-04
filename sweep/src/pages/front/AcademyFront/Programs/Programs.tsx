import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@components/Icons";
import { ScrollView } from "@components/ScrollView";
import { useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { ProgramSimple } from "@fragments/Program";
import { ProgramSimpleType } from "@models/products";
import { getPrograms } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function ProgramManagement() {
  const [programs, setPrograms] = useState<ProgramSimpleType[]>([]);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const { uuid } = useFront();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleCreate = () => {
    router.push("/front/program/create");
  };

  const handleDetail = (program: ProgramSimpleType) => {
    router.push({
      pathname: "/front/program/[id]",
      params: { id: program.id },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response = await getPrograms(uuid);

      if (response) {
        setPrograms(response);
      } else {
        setPrograms([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [uuid, refreshCount]);

  return (
    <View style={styles.container}>
      <ScrollView refreshing={loading} onRefresh={handleRefresh}>
        <View style={styles.wrapper}>
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
      </ScrollView>
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
  });
