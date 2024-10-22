/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock("@components/Buttons", () => ({
  MainButton: () => null,
}));
jest.mock("@components/Icons", () => ({
  AppIcon: () => null,
}));
