import "styled-components/native";

import { ThemeColorType } from "./colors";

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: ThemeColorType;
  }
}
