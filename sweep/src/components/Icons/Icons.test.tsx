import React from "react";

import { AppIcon } from "./AppIcon";
import { CustomLogo, MainLogo, HorizontalLogo, AuthLogo } from "./Logo";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Icons");

describe("<AppIcon />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <AppIcon icon="home" color="black" size={24} />
        <AppIcon icon="home" color="black" />
      </>
    );
  });
});

describe("<CustomLogo />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <CustomLogo image="image" text="text" color="black" />
    );
  });
});

describe("<MainLogo />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <MainLogo />
        <MainLogo blur />
      </>
    );
  });
});

describe("<HorizontalLogo />", () => {
  it("renders correctly", () => {
    renderWithProviders(<HorizontalLogo />);
  });
});

describe("<AuthLogo />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AuthLogo />);
  });
});
