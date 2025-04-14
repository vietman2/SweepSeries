import { StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { LoadingComponent } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useCoachFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import {
  CoachIntroductionEdit,
  CoachProfileImageEdit,
  CoachSNSEdit,
} from "@fragments/Coach";
import { ThemeColorType } from "@themes/colors";

export function CoachProfileManagement() {
  const { coach } = useCoachFront();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!coach) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Scroll style={styles.container}>
        <View style={styles.wrapper}>
          <CoachProfileImageEdit coach={coach} />
          <View style={styles.profile}>
            <Text style={styles.coachName}>
              {`${coach.name} `}
              <Text style={styles.sub}>코치</Text>
            </Text>
            <View style={styles.horizontal}>
              <AppIcon
                icon="person-check"
                size={20}
                color={theme.lowEmphasis}
              />
              <Text style={styles.greenText}>
                {coach.professions.map((p) => p.kor_name).join(", ")}
              </Text>
            </View>
            <View style={styles.horizontal}>
              <AppIcon icon="star" size={20} color="#F2B517" />
              <Text style={styles.grayText}>
                {coach.rating.toFixed(2)} ({coach.num_reviews})
              </Text>
            </View>
          </View>
          <Divider />
          <CoachIntroductionEdit />
          <Divider />
          <CoachSNSEdit />
          <Divider />
        </View>
      </Scroll>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    wrapper: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 16,
    },
    profile: {
      gap: 8,
    },
    coachName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    sub: {
      fontSize: 20,
      color: theme.highEmphasis,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    greenText: {
      fontSize: 14,
      color: theme.primary,
    },
    grayText: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
  });
