import React, { useCallback, useRef } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { AppIcon, CustomLogo } from "@components/Icons";
import { FrontProvider, useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export default function FrontLayout() {
  return (
    <FrontProvider>
      <FrontStack />
    </FrontProvider>
  );
}

function FrontStack() {
  const ref = useRef<BottomSheet>(null);
  const {
    uuid,
    academies,
    coach,
    headerImage,
    headerText,
    selectAcademy,
    selectCoach,
  } = useFront();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleBackPress = () => {
    router.back();
  };

  const BackButton = () => {
    return (
      <TouchableOpacity onPress={handleBackPress} style={{ padding: 8 }}>
        <AppIcon icon="chevron-left" size={20} color={theme.highEmphasis} />
      </TouchableOpacity>
    );
  };

  const handlePress = () => {
    ref.current?.expand();
  };

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

  const headerLeft = () => {
    return (
      <TouchableOpacity
        style={styles.logoWrapper}
        onPress={handlePress}
        testID="opensheet"
      >
        <CustomLogo image={headerImage} text={headerText} color="black" />
        <AppIcon icon="chevron-down" size={16} color={theme.logo} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack screenOptions={{ headerShadowVisible: false }}>
        <Stack.Screen
          name="index"
          options={{ headerTitle: "", headerLeft: headerLeft }}
        />
        <Stack.Screen
          name="program/create"
          options={{
            presentation: "modal",
            headerTitle: "프로그램 등록",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="program/[id]"
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: "아카데미 프로그램",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="notice/[id]"
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: "",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="customer/[id]"
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: "",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="lesson/[id]"
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: "레슨 상세",
            headerShown: true,
          }}
          initialParams={{ mode: "pro" }}
        />
      </Stack>
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
              onPress={() => selectAcademy(academy)}
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
              onPress={() => selectCoach(coach)}
              style={styles.coachSelect}
              testID="coach"
            >
              <CustomLogo
                image={coach.profile_image}
                text={`${coach.name} 코치`}
                color={coach.uuid === uuid ? theme.logo : theme.lowEmphasis}
              />
              {coach.uuid === uuid && (
                <AppIcon icon="check" size={28} color={theme.logo} />
              )}
            </TouchableOpacity>
          )}
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
      paddingVertical: 8,
      gap: 8,
    },
    sheet: {
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 64,
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
