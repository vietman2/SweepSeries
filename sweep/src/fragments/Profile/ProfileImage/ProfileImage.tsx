import { Image, StyleSheet, View } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  uri?: string;
  edit?: boolean;
  color?: string;
}

export function ProfileImage({ uri, edit, color }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (uri) {
    return (
      <View style={styles.imageLarge}>
        <Image src={uri} style={styles.imageLarge} />
        {edit ? (
          <View style={styles.edit}>
            <AppIcon icon="camera" size={25} color={theme.lowEmphasis} />
          </View>
        ) : null}
      </View>
    );
  } else {
    return (
      <View style={[styles.iconLarge, { backgroundColor: color }]}>
        <SvgCssUri
          uri="https://kr.object.ncloudstorage.com/catchb.resources/appicons/default_profile.svg"
          width={"60"}
          height={"60"}
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

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    imageLarge: {
      width: 70,
      height: 70,
      borderRadius: 35,
    },
    iconLarge: {
      width: 70,
      height: 70,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 45,
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
