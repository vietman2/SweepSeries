export type ThemeColorType = {
  primary: string;
  primaryContainer: string;
  secondary: string;
  background: string;
  backgroundGray: string;
  border: string;
  logo: string;
  highEmphasis: string;
  mediumEmphasis: string;
  lowEmphasis: string;
};

export const lightColors: ThemeColorType = {
  primary: "#14863E",
  primaryContainer: "#EDFBE9",
  secondary: "#FC6900",
  background: "#FFFFFF",
  backgroundGray: "#F5F5F5",
  border: "#D9D9D9",
  logo: "#083F25",
  highEmphasis: "#262626",
  mediumEmphasis: "#555555",
  lowEmphasis: "#9D9D9D",
};

export const darkColors: ThemeColorType = {
  primary: "#14863E",
  primaryContainer: "#EDFBE9",
  secondary: "#FC6900",
  background: "#FFFFFF", // #262626
  backgroundGray: "#F5F5F5", // #1A1A1A
  border: "#D9D9D9", // #9D9D9D
  logo: "#083F25",
  highEmphasis: "#262626",
  mediumEmphasis: "#555555",
  lowEmphasis: "#9D9D9D",
};
