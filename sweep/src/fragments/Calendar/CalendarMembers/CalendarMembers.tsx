import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CalendarType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  calendar: CalendarType;
}

export function CalendarMembers({ calendar }: Readonly<Props>) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (expanded) {
    return (
      <View style={styles.expandedContainer}>
        <View style={styles.section}>
          <Text style={styles.subtitle}>소유자</Text>
          <View style={styles.row}>
            <View style={styles.horizontal}>
              <Image src={calendar.owner.profile_image} style={styles.image} />
              <Text>{calendar.owner.name}</Text>
            </View>
            <Text style={styles.me}>나</Text>
          </View>
        </View>
        <Divider />
        <View style={styles.section}>
          <Text style={styles.subtitle}>멤버</Text>
          {calendar.members.map((member) => (
            <View key={member.uuid} style={styles.row}>
              <View style={styles.horizontal}>
                <Image src={member.profile_image} style={styles.image} />
                <Text>{member.name}</Text>
              </View>
            </View>
          ))}
        </View>
        <TouchableOpacity
          onPress={() => setExpanded(false)}
          style={styles.button}
          testID="collapse"
        >
          <AppIcon icon="chevron-up" size={16} color={theme.lowEmphasis} />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={styles.collapsedContainer}
        onPress={() => setExpanded(true)}
        testID="expand"
      >
        <View style={styles.horizontal}>
          <Image src={calendar.owner.profile_image} style={styles.image} />
          {calendar.members.map((member) => (
            <Image
              key={member.uuid}
              src={member.profile_image}
              style={styles.image}
            />
          ))}
        </View>
        <View style={styles.horizontal}>
          <Text style={styles.text}>{calendar.members.length + 1}</Text>
          <AppIcon icon="chevron-down" size={12} color={theme.lowEmphasis} />
        </View>
      </TouchableOpacity>
    );
  }
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    expandedContainer: {
      paddingTop: 16,
      paddingHorizontal: 8,
      gap: 16,
      borderRadius: 8,
      borderWidth: 0.5,
      borderColor: theme.lowEmphasis,
    },
    section: {
      gap: 12,
    },
    subtitle: {
      fontSize: 14,
      color: theme.mediumEmphasis,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 4,
    },
    me: {
      color: theme.primary,
    },
    button: {
      alignItems: "center",
      paddingVertical: 8,
    },
    collapsedContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 8,
      backgroundColor: theme.primaryContainer,
      borderRadius: 8,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    image: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    text: {
      fontSize: 16,
      color: theme.primary,
    },
  });
