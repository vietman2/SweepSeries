import { Image, StyleSheet, View } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";

interface Props {
  uri?: string;
  edit?: boolean;
  color?: string;
  size?: "small" | "large";
}

export function ProfileImage({
  uri,
  edit,
  color,
  size = "small",
}: Readonly<Props>) {
  const { theme } = useTheme();

  if (uri) {
    return (
      <View style={size === "small" ? styles.imageSmall : styles.imageLarge}>
        <Image
          src={uri}
          style={size === "small" ? styles.imageSmall : styles.imageLarge}
        />
        {edit ? (
          <View style={styles.edit}>
            <AppIcon icon="camera" size={25} color={theme.lowEmphasis} />
          </View>
        ) : null}
      </View>
    );
  } else {
    return (
      <View
        style={[
          size === "small" ? styles.iconSmall : styles.iconLarge,
          { backgroundColor: color },
        ]}
      >
        <SvgCssUri
          uri="https://kr.object.ncloudstorage.com/catchb.resources/appicons/default_profile.svg"
          width={size === "small" ? "72" : "135"}
          height={size === "small" ? "72" : "135"}
        />
        {edit ? (
          <View style={styles.edit}>
            <SvgCssUri
              uri="https://kr.object.ncloudstorage.com/catchb.resources/appicons/camera-icon.svg"
              width="25"
              height="25"
              color={theme.lowEmphasis}
            />
          </View>
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  imageSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  imageLarge: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  iconSmall: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
  },
  iconLarge: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 75,
  },
  edit: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
  },
});
