import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

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
    </Scroll>
  );
}

interface SubtitleProps {
  title: string;
}

function Subtitle({ title }: Readonly<SubtitleProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.subtitleWrapper}>
      <Text style={styles.subtitle}>{title}</Text>
      <TouchableOpacity style={styles.editButton}>
        <AppIcon icon="pencil" size={12} color={theme.primary} />
        <Text style={styles.editText}>수정</Text>
      </TouchableOpacity>
    </View>
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
    subtitleWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    editText: {
      fontSize: 16,
      color: theme.primary,
      textAlignVertical: "center",
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
