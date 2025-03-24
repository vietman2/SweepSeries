import { Image, StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useAcademyDetail } from "@contexts/academy";
import { useTheme } from "@contexts/theme";
import { Facilities, Introduction, WorkingHours } from "@fragments/Academy";
import { ThemeColorType } from "@themes/colors";

export function AcademyInformation() {
  const { academy } = useAcademyDetail();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!academy) return null;

  return (
    <View style={styles.container}>
      <Introduction introduction={academy.introduction} />
      <Divider />
      <WorkingHours
        workingHours={academy.schedules}
        scheduleDetails={academy.schedule_details}
      />
      <Divider />
      <Facilities
        facilities={academy.convenience}
        type="구비장비"
        options={[]}
      />
      <Divider />
      <Facilities
        facilities={academy.convenience}
        type="편의시설"
        options={[]}
      />
      <Divider />
      <Subtitle title="지도" />
      <View>
        <Image source={{ uri: academy.map }} style={styles.image} />
        <View style={styles.horizontal}>
          <AppIcon icon="location" size={20} color={theme.primary} />
          <Text style={styles.address}>{academy.address}</Text>
        </View>
      </View>
    </View>
  );
}

interface SubtitleProps {
  title: string;
}

function Subtitle({ title }: Readonly<SubtitleProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return <Text style={styles.subtitle}>{title}</Text>;
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16,
      gap: 16,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    image: {
      width: "100%",
      height: 200,
      marginTop: 4,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 4,
      paddingTop: 4,
    },
    address: {
      color: theme.highEmphasis,
      marginLeft: 4,
    },
  });
