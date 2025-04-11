import { useCallback, useRef } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, router, usePathname } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { ErrorPage, LoadingComponent } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { FrontProvider, useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { SelectedProfile, PromodeProfile } from "@fragments/Profile";
import { AcademyProfileType, CoachProfileType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

export function FrontLayout() {
  return (
    <FrontProvider>
      <Layout />
    </FrontProvider>
  );
}

function Layout() {
  const ref = useRef<BottomSheet>(null);
  const {
    academies,
    coaches,
    activeProfile,
    isReady,
    refreshProfile,
    selectAcademy,
    selectCoach,
  } = useFront();
  const pathname = usePathname();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const openSheet = () => {
    ref.current?.expand();
  };

  const handleBackPress = () => {
    router.back();
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

  const handleAcademySelect = (academy: AcademyProfileType) => {
    selectAcademy(academy);
    ref.current?.close();
  };

  const handleCoachSelect = (coach: CoachProfileType) => {
    selectCoach(coach);
    ref.current?.close();
  };

  const BackButton = () => {
    return (
      <TouchableOpacity
        onPress={handleBackPress}
        style={styles.backButton}
        testID="back-button"
      >
        <AppIcon icon="chevron-left" size={20} color={theme.highEmphasis} />
      </TouchableOpacity>
    );
  };

  if (!isReady) return <LoadingComponent />;

  if (academies.length === 0 && coaches.length === 0) {
    return <ErrorPage onRefresh={refreshProfile} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {!pathname.includes("/front/lesson") && (
        <TouchableOpacity
          style={styles.logoWrapper}
          onPress={openSheet}
          testID="opensheet"
        >
          <SelectedProfile
            image={activeProfile.image}
            text={activeProfile.name}
          />
        </TouchableOpacity>
      )}
      <Stack
        screenOptions={{ headerShown: false, animation: "none" }}
        initialRouteName="academy/[id]"
      >
        <Stack.Screen name="academy/[id]" />
        <Stack.Screen name="coach/[id]" />
        <Stack.Screen
          name="lesson/[id]"
          options={{
            headerShown: true,
            headerTitle: "레슨 상세",
            headerLeft: () => <BackButton />,
          }}
        />
      </Stack>
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={["1%"]}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.sheet}>
          {academies.map((academy) => (
            <TouchableOpacity
              key={academy.uuid}
              onPress={() => handleAcademySelect(academy)}
              style={styles.wrapper}
              testID={`academy-${academy.uuid}`}
            >
              <PromodeProfile
                image={academy.logo}
                text={academy.name}
                selected={academy.uuid === activeProfile.uuid}
              />
            </TouchableOpacity>
          ))}
          {coaches.map((coach) => (
            <TouchableOpacity
              key={coach.uuid}
              onPress={() => handleCoachSelect(coach)}
              style={styles.wrapper}
              testID={`coach-${coach.uuid}`}
            >
              <PromodeProfile
                image={coach.profile_image}
                text={`${coach.name} 코치 (${coach.academy.name})`}
                selected={coach.uuid === activeProfile.uuid}
              />
            </TouchableOpacity>
          ))}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
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
      paddingHorizontal: 16,
      gap: 8,
    },
    sheet: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      gap: 24,
    },
    wrapper: {
      flexDirection: "row",
    },
    backButton: {
      padding: 8,
    },
  });
