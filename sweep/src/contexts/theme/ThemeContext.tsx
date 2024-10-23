import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { lightColors, darkColors, ThemeColorType } from "@themes/colors";

interface ThemeContextType {
  theme: ThemeColorType;
  colorScheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightColors,
  colorScheme: "light",
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    deviceColorScheme === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    setColorScheme(deviceColorScheme === "dark" ? "dark" : "light");
  }, [deviceColorScheme]);

  const theme = colorScheme === "dark" ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext);
}
