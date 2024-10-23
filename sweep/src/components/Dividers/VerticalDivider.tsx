import { View } from "react-native";

interface Props {
  width: number;
  color?: string;
}

export function VerticalDivider({ color = "#D9D9D9", width }: Props) {
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: color,
        width: width,
      }}
    />
  );
}
