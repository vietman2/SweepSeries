import { ReactComponent as Icon } from "./default_profile.svg";

interface Props {
  size: number;
  color: string;
}

export const ProfileIcon = ({ size, color }: Readonly<Props>) => {
  return <Icon width={size} height={size} color={color} />;
};
