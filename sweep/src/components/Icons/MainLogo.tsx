import { StyleSheet, View } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

interface Props {
  size?: number;
  color?: string;
}

export function MainLogo({ size = 160, color = "#083F25" }: Readonly<Props>) {
  return (
    <View style={styles.container}>
      <SvgCssUri
        uri="https://kr.object.ncloudstorage.com/sweepdev/icons/mainlogo_currentcolor.svg"
        width={size}
        height={size}
        color={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    gap: 64,
  },
});
