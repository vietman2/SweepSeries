import { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Divider } from "@components/Dividers";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { SettingType, SettingGroupType } from "@models/customers";
import { sampleSettings } from "@testdata/customers";
import { ThemeColorType } from "@themes/colors";

interface Props {
  setting: SettingType;
  onToggle: () => void;
}

function ToggleObject({ setting, onToggle }: Props) {
  const [isOn, setIsOn] = useState<boolean>(setting.isSet);
  const [animatedValue] = useState(new Animated.Value(isOn ? 1 : 0));

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleToggle = () => {
    setIsOn(!isOn);
    onToggle();
  };

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
    <View style={styles.toggle}>
      <View>
        <Text style={styles.title}>{setting.title}</Text>
        <Text style={styles.subtitle}>{setting.subTitle}</Text>
      </View>
      <TouchableWithoutFeedback
        onPress={handleToggle}
        testID={`toggle-${setting.id}`}
      >
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
    </View>
  );
}

export function Settings() {
  const [settings, setSettings] = useState<SettingGroupType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleToggle = (id: number) => {
    // TODO: send request to update setting
    console.log("Toggle setting with id:", id);
  };

  useEffect(() => {
    setSettings(sampleSettings);
  }, []);

  return (
    <View style={styles.container}>
      <Scroll>
        {settings.map((setting) => (
          <View key={setting.title} style={styles.wrapper}>
            <Text style={styles.subtitleText}>{setting.title}</Text>
            {setting.settings.map((item) => (
              <ToggleObject
                key={item.id}
                setting={item}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
            <Divider />
          </View>
        ))}
      </Scroll>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    },
    toggle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    title: {
      fontSize: 18,
      color: theme.highEmphasis,
    },
    subtitle: {
      marginTop: 4,
      color: theme.lowEmphasis,
    },
    subtitleText: {
      paddingTop: 12,
      paddingBottom: 8,
      fontWeight: "bold",
      fontSize: 16,
      color: theme.lowEmphasis,
    },
    wrapper: {
      paddingVertical: 8,
    },
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
