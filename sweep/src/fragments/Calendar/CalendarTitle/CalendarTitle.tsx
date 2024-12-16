import { StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { CalendarType } from "@models/calendar";

interface Props {
  calendar: CalendarType;
}

export function CalendarTitle({ calendar }: Readonly<Props>) {
  return (
    <View style={styles.container}>
      <View style={[styles.fill, { backgroundColor: calendar.color }]}>
        <Text style={styles.character}>{calendar.name[0]}</Text>
      </View>
      <Text style={styles.title}>{calendar.name}</Text>
      <AppIcon icon="chevron-down" size={16} color="gray" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fill: {
    alignItems: "center",
    justifyContent: "center",
    width: 35,
    height: 35,
    borderRadius: 8,
  },
  character: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
});
