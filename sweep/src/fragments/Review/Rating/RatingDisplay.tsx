import { StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";

interface Props {
  rating: number;
}

export function RatingDiaplay({ rating }: Readonly<Props>) {
  return (
    <View style={styles.container}>
      <AppIcon icon="star" size={16} color="#F2B517" />
      <AppIcon
        icon={rating >= 2 ? "star" : "star-outline"}
        size={16}
        color="#F2B517"
      />
      <AppIcon
        icon={rating >= 3 ? "star" : "star-outline"}
        size={16}
        color="#F2B517"
      />
      <AppIcon
        icon={rating >= 4 ? "star" : "star-outline"}
        size={16}
        color="#F2B517"
      />
      <AppIcon
        icon={rating == 5 ? "star" : "star-outline"}
        size={16}
        color="#F2B517"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
