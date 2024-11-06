import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

const { width } = Dimensions.get("window");

interface Props {
  pro?: boolean;
}

export function AcademyProfile({ pro }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.wrapper}>
        {pro && (
          <TouchableOpacity style={styles.button}>
            <AppIcon icon="images" size={20} color="white" />
            <Text style={styles.buttonText}>대표 사진 변경</Text>
          </TouchableOpacity>
        )}
        <Image
          src={
            "https://mblogthumb-phinf.pstatic.net/MjAyNDA4MTJfMTk1/MDAxNzIzNDcwMDkyNjI1.CIzE8pfUnv-yPLFphjW8gHScETczni_iOFx9lYYCxrwg.401U8w3xp21TmyobrG2pC1AbGA4kNXahLRe99Jog5Ysg.JPEG/IMG_8197.jpeg?type=w800"
          }
          style={styles.image}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Catch B 아카데미</Text>
        <View style={styles.horizontal}>
          <AppIcon icon="location" size={20} color={theme.lowEmphasis} />
          <Text style={styles.infoText}>
            인천시 서구 청라한내로 72번길 17, 416호
          </Text>
        </View>
        <View style={styles.horizontal}>
          <AppIcon icon="star" size={20} color="#F2B517" />
          <Text style={styles.infoText}>{(4.2).toFixed(2)} (42)</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      paddingBottom: 8,
      gap: 16,
      backgroundColor: theme.background,
    },
    wrapper: {
      position: "relative",
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 8,
      position: "absolute",
      right: 8,
      bottom: 8,
      borderRadius: 8,
      backgroundColor: "#00000050",
      zIndex: 1,
    },
    buttonText: {
      color: "white",
    },
    image: {
      flex: 1,
      width,
      height: (width * 9) / 16,
      zIndex: 0,
    },
    header: {
      paddingHorizontal: 16,
      gap: 4,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    infoText: {
      color: theme.lowEmphasis,
    },
  });
