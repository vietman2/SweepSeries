import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { Facilities, Introduction, WorkingHours } from "@fragments/Academy";
import { AcademyDetailType } from "@models/products";
import { sampleAcademyDetail } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function Information() {
  const [academy, setAcademy] = useState<AcademyDetailType>();

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setAcademy(sampleAcademyDetail);
  }, []);

  if (!academy) return null;

  return (
    <View style={styles.container}>
      <Subtitle title="아카데미 소개" />
      <Introduction introduction={academy.introduction} />
      <Divider />
      <Subtitle title="운영시간" />
      <WorkingHours workingHours={academy.working_hours} />
      <Divider />
      <Subtitle title="구비시설" />
      <Facilities facilities={academy.facilities} type="구비장비" />
      <Divider />
      <Subtitle title="편의시설 및 서비스" />
      <Facilities facilities={academy.facilities} type="편의시설" />
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
      marginTop: 5,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 5,
      paddingTop: 5,
    },
    address: {
      color: theme.highEmphasis,
      marginLeft: 5,
    },
  });
