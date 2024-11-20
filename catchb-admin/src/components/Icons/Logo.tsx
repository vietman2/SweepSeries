import { ReactComponent as SweepSeriesLogo } from "./sweepseries.svg";

interface Props {
  size?: number;
}

export function MainLogo({ size = 160 }: Readonly<Props>) {
  return <SweepSeriesLogo width={size} height={size} />;
}
