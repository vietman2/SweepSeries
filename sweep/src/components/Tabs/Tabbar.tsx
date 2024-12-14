import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";

import { Scroll } from "@components/ScrollView";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

const { width: screenWidth } = Dimensions.get("window");

interface Props extends MaterialTopTabBarProps {
  scrollable?: boolean;
}

export function TabBar({
  state,
  descriptors,
  navigation,
  position,
  scrollable,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const tabWidth = screenWidth / state.routes.length;

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth]);

  if (scrollable) {
    return (
      <View>
        <Scroll
          style={styles.scrollableContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.title;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            const inputRange = state.routes.map((_, i) => i);
            const opacity = position.interpolate({
              inputRange,
              outputRange: inputRange.map((i) => (i === index ? 1 : 0.8)),
            });

            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[styles.scrollableTab, isFocused && styles.selectedTab]}
                key={route.key}
                testID={label}
              >
                <Animated.Text
                  style={[
                    styles.text,
                    isFocused && styles.selectedText,
                    { opacity },
                  ]}
                >
                  {label}
                </Animated.Text>
              </TouchableOpacity>
            );
          })}
        </Scroll>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const inputRange = state.routes.map((_, i) => i);
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i) => (i === index ? 1 : 0.8)),
          });

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
              key={route.key}
              testID={label}
            >
              <Animated.Text
                style={[
                  styles.text,
                  isFocused && styles.selectedText,
                  { opacity },
                ]}
              >
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Animated.View
        style={[
          styles.indicator,
          { width: tabWidth, transform: [{ translateX }] },
        ]}
      />
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      position: "relative",
    },
    tabContainer: {
      flexDirection: "row",
      borderBottomWidth: 0.2,
      borderBottomColor: theme.border,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 12,
    },
    text: {
      color: theme.lowEmphasis,
      fontSize: 20,
      fontWeight: "bold",
    },
    selectedText: {
      color: theme.primary,
    },
    indicator: {
      height: 3,
      backgroundColor: theme.primary,
      position: "absolute",
      bottom: 0,
      left: 0,
    },
    scrollableContainer: {
      flexDirection: "row",
      backgroundColor: theme.background,
      borderBottomWidth: 0.2,
      borderBottomColor: theme.border,
    },
    scrollableTab: {
      alignItems: "center",
      paddingVertical: 8,
      width: 80,
    },
    selectedTab: {
      borderBottomWidth: 2,
      borderBottomColor: theme.primary,
    },
  });
