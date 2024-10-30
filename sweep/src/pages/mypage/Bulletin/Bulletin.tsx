import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AnnouncementSimpleType } from "@models/customers";
import { sampleAnnouncements } from "@testdata/customers";
import { ThemeColorType } from "@themes/colors";

export function Bulletin() {
  const [announcements, setAnnouncements] = useState<AnnouncementSimpleType[]>(
    []
  );

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setAnnouncements(sampleAnnouncements);
  }, []);

  return (
    <Scroll style={styles.container}>
      {announcements.map((announcement) => (
        <View key={announcement.id} style={styles.listitem}>
          <Text style={styles.title}>{announcement.title}</Text>
          <Text style={styles.date}>{announcement.created_at}</Text>
        </View>
      ))}
    </Scroll>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    listitem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    title: {
      flex: 1,
    },
    date: {
      color: theme.lowEmphasis,
    },
  });
