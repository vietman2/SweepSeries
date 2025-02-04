import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import {
  AcademyProfile,
  Facilities,
  Introduction,
  WorkingHours,
} from "@fragments/Academy";
import { AcademyDetailType, FacilityType } from "@models/products";
import { getFacilityOptions, getAcademyDetail } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function ProfileManagement() {
  const [academy, setAcademy] = useState<AcademyDetailType>();
  const [facilityOptions, setFacilityOptions] = useState<FacilityType[]>([]);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { refresh } = useFront();

  const onRefresh = () => {
    setRefreshCount((prev) => prev + 1);
    refresh();
  };

  const { uuid } = useFront();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAcademyDetail(uuid);
      const options = await getFacilityOptions();

      if (options && response) {
        setAcademy(response);
        setFacilityOptions(options);
      }
    };

    fetchData();
  }, [refreshCount, uuid]);

  if (!academy) return null;

  return (
    <Scroll style={styles.container}>
      <AcademyProfile pro academy={academy} onRefresh={onRefresh} />
      <View style={styles.content}>
        <Divider />
        <Introduction
          introduction={academy.introduction}
          edit
          onRefresh={onRefresh}
        />
        <Divider />
        <WorkingHours
          workingHours={academy.schedules}
          scheduleDetails={academy.schedule_details}
          edit
          onRefresh={onRefresh}
        />
        <Divider />
        <Facilities
          facilities={academy.convenience}
          options={facilityOptions}
          type="구비장비"
          edit
          onRefresh={onRefresh}
        />
        <Divider />
        <Facilities
          facilities={academy.convenience}
          options={facilityOptions}
          type="편의시설"
          edit
          onRefresh={onRefresh}
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
    mapWrapper: {
      marginBottom: 16,
    },
  });
