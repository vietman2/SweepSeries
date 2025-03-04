import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { CoachSelect } from "@fragments/Coach";
import { TeamType } from "@models/products";

interface Props {
  team: TeamType;
  removeTeam?: () => void;
}

export function CoachTeam({ team, removeTeam }: Readonly<Props>) {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.coaches}>
          {team.coaches.map((coach) => (
            <CoachSelect key={coach.uuid} coach={coach} />
          ))}
        </View>
        {removeTeam && (
          <TouchableOpacity onPress={removeTeam} testID="remove">
            <AppIcon icon="close" size={18} color="red" />
          </TouchableOpacity>
        )}
      </View>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  coaches: {
    flex: 1,
    flexDirection: "row",
  },
});
