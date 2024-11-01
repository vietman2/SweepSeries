import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { SvgIconButton, TextButton, Toggle } from "@components/Buttons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function Settings() {
  const [isNotificationOn, setIsNotificationOn] = useState<boolean>(false);
  const [isDailyOn, setIsDailyOn] = useState<boolean>(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleNotificationToggle = () => {
    setIsNotificationOn((prev) => !prev);
  };

  const handleDailyToggle = () => {
    setIsDailyOn((prev) => !prev);
  };

  const handleCloseModal = () => {
    if (isDailyOn) {
      setIsDailyOn(false);
    } else {
      router.back();
    }
  };

  const handleCloseSheet = () => {
    setIsDailyOn(false);
  };

  const handleConfirmTime = () => {
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    if (isDailyOn) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isDailyOn]);

  return (
    <>
      <View style={styles.backdrop}>
        <Pressable onPress={handleCloseModal} style={StyleSheet.absoluteFill} testID="close-modal" />
        <View style={styles.modal}>
          <Pressable
            onPress={handleCloseSheet}
            style={StyleSheet.absoluteFill}
            testID="close-sheet"
          />
          <View style={styles.content}>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>공유하는 멤버</Text>
              <SvgIconButton
                icon="person-add"
                text="멤버 추가하기"
                onPress={() => {}}
                color={theme.background}
                backgroundColor={theme.primary}
                align="center"
              />
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>캘린더 정보</Text>
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>알림</Text>
              <View style={styles.horizontal}>
                <Text>알림 받기</Text>
                <Toggle
                  isOn={isNotificationOn}
                  onToggle={handleNotificationToggle}
                />
              </View>
              <View style={styles.horizontal}>
                <Text>오늘 알림 받기</Text>
                <Toggle isOn={isDailyOn} onToggle={handleDailyToggle} />
              </View>
            </View>
          </View>
          <View>
            <TextButton
              text="캘린더 삭제하기"
              onPress={() => {}}
              color={theme.lowEmphasis}
              backgroundColor={theme.background}
            />
          </View>
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableHandlePanningGesture={false}
      >
        <BottomSheetView style={styles.sheetContainer}>
          <View style={styles.timepickerwrapper}>
            <Text style={styles.sheetTitle}>알림 시간을 설정하세요.</Text>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <TextButton text="확인" onPress={handleConfirmTime} />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000060",
    },
    modal: {
      flex: 1,
      position: "absolute",
      top: 0,
      right: 0,
      width: "80%",
      height: "100%",
      paddingTop: 72,
      paddingBottom: 32,
      paddingHorizontal: 24,
      backgroundColor: theme.background,
      borderBottomLeftRadius: 16,
      borderTopLeftRadius: 16,
    },
    content: {
      flex: 1,
      gap: 32,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    wrapper: {
      gap: 8,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sheetContainer: {
      flex: 1,
      alignItems: "center",
      marginBottom: 32,
      paddingTop: 8,
      paddingHorizontal: 24,
    },
    timepickerwrapper: {
      flex: 1,
    },
    sheetTitle: {
      fontSize: 20,
      color: theme.highEmphasis,
    },
    buttonContainer: {
      flexDirection: "row",
    },
    buttonWrapper: {
      flex: 1,
    },
  });
