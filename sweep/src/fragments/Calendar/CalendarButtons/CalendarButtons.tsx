import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CalendarButtons({ open, setOpen }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSchedulePress = () => {
    router.push("/calendar/addschedule");
    setOpen(false);
  }

  return (
    <View style={styles.container}>
      {open ? (
        <>
          <View style={styles.wrapper}>
            <Text style={styles.text}>메모</Text>
            <TouchableOpacity style={styles.button}>
              <AppIcon icon="memo" size={20} color={theme.lowEmphasis} />
            </TouchableOpacity>
          </View>
          <View style={styles.wrapper}>
            <Text style={styles.text}>할 일</Text>
            <TouchableOpacity style={styles.button}>
              <AppIcon
                icon="check-circle"
                size={20}
                color={theme.lowEmphasis}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.wrapper}>
            <Text style={styles.text}>일정</Text>
            <TouchableOpacity style={styles.button} onPress={handleSchedulePress} testID="addschedule">
              <AppIcon
                icon="calendar-pointer"
                size={20}
                color={theme.lowEmphasis}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.wrapper}>
            <Text style={styles.text}>예약 추가</Text>
            <TouchableOpacity style={styles.button}>
              <AppIcon
                icon="calendar-plus"
                size={20}
                color={theme.lowEmphasis}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.wrapper}>
            <Text style={styles.text}>예약 승인</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
            >
              <AppIcon icon="checkbox" size={20} color={theme.background} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => setOpen(true)}
          testID="open"
        >
          <AppIcon icon="plus" size={20} color={theme.background} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      alignItems: "flex-end",
      position: "absolute",
      right: 24,
      bottom: 16,
      gap: 16,
      zIndex: 1,
    },
    wrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    text: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    button: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.background,
      borderRadius: 20,
    },
  });
