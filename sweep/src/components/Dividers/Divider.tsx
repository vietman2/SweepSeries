import { View } from "react-native";

interface Props {
  color?: string;
  bold?: boolean;
}

export function Divider({
  color = "#D9D9D9",
  bold = false,
}: Readonly<Props>) {
  return (
    <View
      style={{
        height: bold ? 2 : 1,
        backgroundColor: color,
      }}
    />
  );
}
