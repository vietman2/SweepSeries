import { Image, StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { ScrollView } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useAcademyFront, useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import {
  AcademyProfile,
  Facilities,
  Introduction,
  WorkingHours,
} from "@fragments/Academy";
import { ThemeColorType } from "@themes/colors";

export function AcademyProfileManagement() {
  const { academy, facilityOptions, loading, refresh } = useAcademyFront();
  const { refreshProfile } = useFront();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefreshProfile = () => {
    refresh();
    refreshProfile();
  };

  if (!academy) return null;

  return (
    <ScrollView
      refreshing={loading}
      onRefresh={refresh}
      style={styles.container}
    >
      <AcademyProfile pro academy={academy} onRefresh={handleRefreshProfile} />
      <View style={styles.content}>
        <Divider />
        <Introduction
          introduction={academy.introduction}
          edit
          onRefresh={refresh}
        />
        <Divider />
        <WorkingHours
          workingHours={academy.schedules}
          scheduleDetails={academy.schedule_details}
          edit
          onRefresh={refresh}
        />
        <Divider />
        <Facilities
          facilities={academy.convenience}
          options={facilityOptions}
          type="구비장비"
          edit
          onRefresh={refresh}
        />
        <Divider />
        <Facilities
          facilities={academy.convenience}
          options={facilityOptions}
          type="편의시설"
          edit
          onRefresh={refresh}
        />
        <Divider />
        <Text style={styles.subtitle}>지도</Text>
        <View style={styles.mapWrapper}>
          <Image source={{ uri: academy.map }} style={styles.image} />
          <View style={styles.horizontal}>
            <AppIcon icon="location" size={20} color={theme.primary} />
            <Text style={styles.address}>{academy.address}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingHorizontal: 16,
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
    mapWrapper: {
      marginBottom: 16,
    },
  });
