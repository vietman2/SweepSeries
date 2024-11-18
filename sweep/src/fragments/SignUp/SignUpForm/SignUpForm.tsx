import { Keyboard, Pressable, StyleSheet, View } from "react-native";

import { TextButton } from "@components/Buttons";
import { ErrorPage, LoadingComponent } from "@components/Fallbacks";
import { MainLogo } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  buttonText: string;
  buttonOnPress: () => void;
  buttonDisabled: boolean;
  loading?: boolean;
  error?: boolean;
}

export function SignUpForm({
  title,
  subtitle,
  children,
  buttonText,
  buttonOnPress,
  buttonDisabled,
  loading = false,
  error = false,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (loading) return <LoadingComponent />;
  if (error) return <ErrorPage />;

  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.container}>
      <View style={styles.background}>
        <MainLogo color={theme.logo} blur />
      </View>
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {children}
      </View>
      <TextButton
        text={buttonText}
        backgroundColor={theme.primary}
        onPress={buttonOnPress}
        fontSize={18}
        active={!buttonDisabled}
      />
    </Pressable>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 36,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    background: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    page: {
      flex: 1,
      paddingVertical: 16,
      gap: 16,
    },
    header: {
      gap: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    subtitle: {
      fontSize: 16,
      color: theme.lowEmphasis,
    },
  });
