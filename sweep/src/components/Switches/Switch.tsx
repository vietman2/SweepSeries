import { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import { useTheme } from "@contexts/theme";

interface Props {
  isOn: boolean;
  onToggle: () => void;
}

export function Switch({ isOn, onToggle }: Props) {
  const [animatedValue] = useState(new Animated.Value(isOn ? 1 : 0));

  const { theme } = useTheme();

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isOn, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 21],
  });

  return (
    <TouchableWithoutFeedback onPress={onToggle}>
      <Animated.View
        style={[
          styles.switch,
          {
            backgroundColor: isOn ? "#3A86FF" : theme.lowEmphasis,
          },
        ]}
      >
        <Animated.View
          style={[styles.wheel, { transform: [{ translateX }] }]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  switch: {
    width: 40,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
  },
  wheel: {
    width: 18,
    height: 18,
    backgroundColor: "white",
    borderRadius: 9,
  },
});
