import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Text } from "@components/Texts";

export function DailySchedule() {
  const { date } = useLocalSearchParams();

  return (
    <View>
      <Text>{date}</Text>
    </View>
  );
}
