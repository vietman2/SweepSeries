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

interface VerticalProps {
  width: number;
  color?: string;
}

export function VerticalDivider({
  color = "#D9D9D9",
  width,
}: Readonly<VerticalProps>) {
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
