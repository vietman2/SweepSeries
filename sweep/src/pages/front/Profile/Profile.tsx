import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import {
  AcademyProfile,
  Facilities,
  Introduction,
  WorkingHours,
} from "@fragments/Academy";
import { AcademyDetailType } from "@models/products";
import { sampleAcademyDetail } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function ProfileManagement() {
  const [academy, setAcademy] = useState<AcademyDetailType>();

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setAcademy(sampleAcademyDetail);
  }, []);

  if (!academy) return null;

  return (
    <Scroll style={styles.container}>
      <AcademyProfile pro />
      <View style={styles.content}>
        <Divider bold />
        <Introduction introduction={academy.introduction} />
        <Divider />
        <WorkingHours workingHours={academy.working_hours} />
        <Divider />
        <Facilities facilities={academy.facilities} type="구비장비" />
        <Divider />
        <Facilities facilities={academy.facilities} type="편의시설" />
        <Divider />
        <Text style={styles.subtitle}>지도</Text>
        <View>
          <Image source={{ uri: academy.map }} style={styles.image} />
          <View style={styles.horizontal}>
            <AppIcon icon="location" size={20} color={theme.primary} />
            <Text style={styles.address}>{academy.address}</Text>
          </View>
        </View>
      </View>
    </Scroll>
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
  });
