import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export function AcademyDetail() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>{id}</Text>
    </View>
  );
}
