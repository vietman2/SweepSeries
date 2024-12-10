/* eslint-disable @typescript-eslint/no-require-imports */
import "expo-dev-client";
import "react-native-reanimated";
import { configureReanimatedLogger } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { Stack, SplashScreen } from "expo-router";
import axios from "axios";

import { AuthProvider, useAuth } from "@contexts/auth";
import { ThemeProvider } from "@contexts/theme";
import { getProfile, refresh } from "@services/auth";

SplashScreen.preventAutoHideAsync();

configureReanimatedLogger({
  strict: false,
});

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Sweep: require("@assets/fonts/NPSfont_bold.ttf"),
    SweepLight: require("@assets/fonts/NPSfont_regular.ttf"),
    SweepBold: require("@assets/fonts/NPSfont_bold.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const getImagePickerPermissions = async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
    };

    if (loaded) {
      SplashScreen.hideAsync();
    }

    getImagePickerPermissions();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GestureHandlerRootView>
          <AppRouter />
        </GestureHandlerRootView>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppRouter() {
  const [ready, setReady] = useState<boolean>(false);

  const { login } = useAuth();

  useEffect(() => {
    const fetchProfile = async (token: string) => {
      const response = await getProfile(token);

      if (response) {
        login("normal", response.profile);
      }

      setReady(true);
    };

    const refreshToken = async () => {
      const response = await refresh();

      if (response) {
        fetchProfile(response.access);
      } else {
        setReady(true);
      }
    };

    refreshToken();
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
