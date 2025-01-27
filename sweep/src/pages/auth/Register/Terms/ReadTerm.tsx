import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { useTheme } from "@contexts/theme";
import { AgreementType } from "@models/auth";
import { getAgreementContent } from "@services/auth";
import { ThemeColorType } from "@themes/colors";

export function ReadTerm() {
  const [agreement, setAgreement] = useState<AgreementType>();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleClose = () => {
    router.back();
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAgreementContent(id);

      if (response) {
        setAgreement(response);
      }
    };

    fetchData();
  }, [id]);

  if (!agreement) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{agreement.title}</Text>
        <View style={styles.divider}>
          <Divider />
        </View>
        <Text style={styles.content}>{agreement.content}</Text>
        <TextButton text="닫기" onPress={handleClose} />
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 24,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    divider: {
      marginVertical: 16,
    },
    content: {
      minHeight: 600,
    },
  });
