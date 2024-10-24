export type ThemeColorType = {
  primary: string;
  secondary: string;
  background: string;
  border: string;
  logo: string;
  highEmphasis: string;
  lowEmphasis: string;
};

export const lightColors: ThemeColorType = {
  primary: "#14863E",
  secondary: "#FC6900",
  background: "#FFFFFF",
  border: "#D9D9D9",
  logo: "#083F25",
  highEmphasis: "#262626",
  lowEmphasis: "#9D9D9D",
};

export const darkColors: ThemeColorType = {
  primary: "#14863E",
  secondary: "#FC6900",
  background: "#262626",
  border: "#9D9D9D",
  logo: "#FFFFFF",
  highEmphasis: "#F5F5F5",
  lowEmphasis: "#D9D9D9",
};
