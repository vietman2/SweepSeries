import { SvgCssUri } from "react-native-svg/css";

interface Props {
  icon: string;
  color: string;
  size?: number;
}

export function AppIcon({ icon, color, size = 28 }: Props) {
  return (
    <SvgCssUri
      width={size}
      height={size}
      uri={`https://kr.object.ncloudstorage.com/sweepdev/icons/${icon}.svg`}
      color={color}
    />
  );
}
