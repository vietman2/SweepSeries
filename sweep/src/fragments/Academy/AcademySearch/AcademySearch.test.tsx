/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, waitFor } from "@testing-library/react-native";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

import { AcademySearch } from "./AcademySearch";
import * as AcademiesAPI from "@services/products/academy";
import { sampleAcademies } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@gorhom/bottom-sheet", () => {
  const { forwardRef } = jest.requireActual("react");

  return {
    __esModule: true,
    default: forwardRef(
      (
        {
          backdropComponent,
          children,
        }: {
          backdropComponent: React.FC<BottomSheetBackdropProps>;
          children: React.ReactNode;
        },
        ref
      ) => (
        <>
          {backdropComponent &&
            backdropComponent({
              animatedIndex: {
                value: 0,
                get: jest.fn(),
                set: jest.fn(),
                modify: jest.fn(),
                addListener: jest.fn(),
                removeListener: jest.fn(),
              },
              animatedPosition: {
                value: 0,
                get: jest.fn(),
                set: jest.fn(),
                modify: jest.fn(),
                addListener: jest.fn(),
                removeListener: jest.fn(),
              },
            })}
          {children}
        </>
      )
    ),
    BottomSheetBackdrop: () => "BottomSheetBackdrop",
    BottomSheetBackdropProps: {},
    BottomSheetView: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.mock("../AcademySimple/AcademySimple", () => ({
  AcademySimple: () => <div>AcademySimple</div>,
}));

describe("<AcademySearch />", () => {
  it("renders and handles sort and navigation", async () => {
    jest.spyOn(AcademiesAPI, "getAcademies").mockResolvedValue(sampleAcademies);

    const { getByTestId } = renderWithProviders(
      <AcademySearch refreshCount={0} />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("sort-button"));
      fireEvent.press(getByTestId("sort-item-인기순"));
      fireEvent.press(getByTestId("academy-detail-1"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(AcademiesAPI, "getAcademies").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(
      <AcademySearch refreshCount={0} />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("sort-button"));
    });
  });
});
