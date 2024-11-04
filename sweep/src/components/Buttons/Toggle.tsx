import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

import { useTheme } from "@contexts/theme";

interface Props {
  isOn: boolean;
  onToggle: () => void;
}

export function Toggle({ isOn, onToggle }: Readonly<Props>) {
  const ballPosition = useRef(new Animated.Value(isOn ? 25 : 0)).current;
  const { theme } = useTheme();

    useEffect(() => {
      Animated.timing(ballPosition, {
        toValue: isOn ? 25 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [isOn, ballPosition]);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isOn ? theme.primary : "#EFEFEF" },
      ]}
      onPress={onToggle}
      testID="toggle"
    >
      <Animated.View style={[styles.ball, { marginLeft: ballPosition }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 20,
    paddingHorizontal: 2,
    borderRadius: 10,
    backgroundColor: "#EFEFEF",
  },
  ball: {
    width: 16,
    height: 16,
    marginTop: 2,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
});
