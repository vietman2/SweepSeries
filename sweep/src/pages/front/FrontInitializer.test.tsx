import { FrontInitializer } from "./FrontInitializer";
import * as FrontContext from "@contexts/front";
import * as StorageAPI from "@services/storage/asyncstorage";
import { sampleAcademyProfiles, sampleCoachProfiles } from "@testdata/products";
import { waitFor } from "@testing-library/react-native";
import { renderWithProviders } from "@utils/test-utils";

describe("<FrontInitializer />", () => {
  const defaultContext = {
    academies: [],
    coaches: [],
    selectedProfile: {
      image: "",
      name: "",
    },
    selectAcademy: jest.fn(),
    selectCoach: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.spyOn(FrontContext, "useFront").mockReturnValue(defaultContext);
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValue(null);
  });

  it("handles loading", () => {
    jest
      .spyOn(FrontContext, "useFront")
      .mockReturnValue({ ...defaultContext, loading: true });

    renderWithProviders(<FrontInitializer />);
  });

  it("handles no value in storage and initialize as academy owner", () => {
    jest
      .spyOn(FrontContext, "useFront")
      .mockReturnValue({ ...defaultContext, academies: sampleAcademyProfiles });

    renderWithProviders(<FrontInitializer />);
  });

  it("handles no value in storage and initialize as coach", () => {
    jest
      .spyOn(FrontContext, "useFront")
      .mockReturnValue({ ...defaultContext, coaches: sampleCoachProfiles });

    renderWithProviders(<FrontInitializer />);
  });

  it("handles academy in storage", async () => {
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValueOnce("academy");
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValueOnce("uuid");

    await waitFor(() => renderWithProviders(<FrontInitializer />));
  });

  it("handles coach in storage", async () => {
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValueOnce("coach");
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValueOnce("uuid");

    await waitFor(() => renderWithProviders(<FrontInitializer />));
  });

  it("handles initialize fail", () => {
    renderWithProviders(<FrontInitializer />);
  });
});
