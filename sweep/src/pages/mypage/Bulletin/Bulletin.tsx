import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AnnouncementType } from "@models/customers";
import { getAnnouncements } from "@services/app";
import { ThemeColorType } from "@themes/colors";

export function Bulletin() {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAnnouncements();

      if (response) {
        setAnnouncements(response);
      } else {
        setAnnouncements([]);
      }
    };

    fetchData();
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
      paddingVertical: 12,
      paddingHorizontal: 16,
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
