import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { AcademyFront } from "../AcademyFront/AcademyFront";
import { CoachFront } from "../CoachFront/CoachFront";
import { Divider } from "@components/Dividers";
import { LoadingComponent } from "@components/Fallbacks";
import { AppIcon, CustomLogo } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AcademySimpleType, CoachSimpleType } from "@models/products";
import { getMyAcademies, getMyCoachProfile } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function Front() {
  const [academies, setAcademies] = useState<AcademySimpleType[]>([]);
  const [coach, setCoach] = useState<CoachSimpleType>();
  const [mode, setMode] = useState<"academy" | "coach" | null>(null);
  const [uuid, setUuid] = useState<string>("");

  const ref = useRef<BottomSheet>(null);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handlePress = () => {
    ref.current?.expand();
  };

  const handleAcademySelect = (academy: AcademySimpleType) => {
    setUuid(academy.uuid);
    setMode("academy");
    ref.current?.close();
  };

  const handleCoachSelect = (coach: CoachSimpleType) => {
    setUuid(coach.uuid);
    setMode("coach");
    ref.current?.close();
  };

  useEffect(() => {
    const fetchData = async () => {
      const response1 = await getMyAcademies();
      const response2 = await getMyCoachProfile();

      if (response2) {
        setCoach(response2);
        setUuid(response2.uuid);
        setMode("coach");
      }

      if (response1) {
        setAcademies(response1);
        setUuid(response1[0].uuid);
        setMode("academy");
      }
    };

    fetchData();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  if (mode === null) return <LoadingComponent />;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.logoWrapper}
          onPress={handlePress}
          testID="opensheet"
        >
          {mode === "academy" ? (
            <CustomLogo
              image={academies[0].logo}
              text={academies[0].name}
              color="black"
            />
          ) : (
            <View style={styles.row}>
              <Image src={coach?.profile_image} style={styles.profileImage} />
              <Text style={styles.coachProfile}>{coach?.name} 코치</Text>
            </View>
          )}
          <AppIcon icon="chevron-down" size={16} color={theme.logo} />
        </TouchableOpacity>
        {mode === "academy" ? <AcademyFront uuid={uuid} /> : null}
        {mode === "coach" ? <CoachFront uuid={uuid} /> : null}
      </SafeAreaView>
      <BottomSheet
        ref={ref}
        index={-1}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.sheet}>
          {academies.map((academy) => (
            <TouchableOpacity
              key={academy.uuid}
              onPress={() => handleAcademySelect(academy)}
              style={styles.academySelect}
              testID={`academy-${academy.uuid}`}
            >
              <CustomLogo
                image={academy.logo}
                text={academy.name}
                color={academy.uuid === uuid ? theme.logo : theme.lowEmphasis}
              />
              {academy.uuid === uuid && (
                <AppIcon icon="check" size={28} color={theme.logo} />
              )}
            </TouchableOpacity>
          ))}
          {coach && (
            <TouchableOpacity
              onPress={() => handleCoachSelect(coach)}
              style={styles.coachSelect}
              testID="coach"
            >
              <View style={styles.row}>
                <Image src={coach?.profile_image} style={styles.profileImage} />
                <Text
                  style={[
                    styles.coachProfile,
                    {
                      color:
                        coach.uuid === uuid 
                        ? theme.logo 
                        : theme.lowEmphasis,
                    },
                  ]}
                >
                  {coach?.name} 코치
                </Text>
              </View>
              {coach.uuid === uuid && (
                <AppIcon icon="check" size={28} color={theme.logo} />
              )}
            </TouchableOpacity>
          )}
          <Divider />
          <TouchableOpacity
            onPress={() => ref.current?.close()}
            style={styles.button}
            testID="close"
          >
            <Text style={styles.buttonText}>닫기</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    logoWrapper: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 8,
    },
    coachProfile: {
      color: theme.logo,
      fontSize: 22,
      fontWeight: "bold",
    },
    sheet: {
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 24,
    },
    academySelect: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    profileImage: {
      width: 30,
      height: 30,
      borderRadius: 4,
    },
    coachSelect: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    button: {
      alignSelf: "center",
    },
    buttonText: {
      marginBottom: 8,
      color: theme.mediumEmphasis,
      fontSize: 18,
      fontWeight: "bold",
    },
  });
