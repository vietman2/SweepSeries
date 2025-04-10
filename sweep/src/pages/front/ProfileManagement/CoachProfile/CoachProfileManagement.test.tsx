import { fireEvent, waitFor } from "@testing-library/react-native";

import { CoachProfileManagement } from "./CoachProfileManagement";
import * as CoachFrontContext from "@contexts/front";
import * as CoachesAPI from "@services/products/coach";
import { sampleCoachDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachProfileManagement />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(CoachFrontContext, "useCoachFront").mockReturnValue({
      coach: sampleCoachDetail,
      loading: false,
      refresh: jest.fn(),
    });
  });

  it("handles loading", async () => {
    jest.spyOn(CoachFrontContext, "useCoachFront").mockReturnValue({
      coach: undefined,
      loading: false,
      refresh: jest.fn(),
    });

    renderWithProviders(<CoachProfileManagement />);
  });

  it("handles intro and sns updates", async () => {
    jest.spyOn(CoachesAPI, "updateCoachIntro").mockResolvedValue(true);
    jest.spyOn(CoachesAPI, "updateCoachSNS").mockResolvedValue(true);

    const { getByTestId, getAllByTestId } = renderWithProviders(
      <CoachProfileManagement />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("open-intro"));
      fireEvent.changeText(getByTestId("소개글을 입력하세요."), "New intro");
      fireEvent.press(getAllByTestId("저장")[0]);

      fireEvent.press(getByTestId("open-sns"));
      fireEvent.changeText(
        getByTestId("인스타그램 링크를 입력하세요."),
        "instagram.com/new"
      );
      fireEvent.changeText(
        getByTestId("블로그 링크를 입력하세요."),
        "blog.com/new"
      );
      fireEvent.press(getAllByTestId("저장")[1]);
    });
  });

  it("handles intro and sns open and update fail", async () => {
    jest.spyOn(CoachFrontContext, "useCoachFront").mockReturnValue({
      coach: { ...sampleCoachDetail, instagram: "" },
      loading: false,
      refresh: jest.fn(),
    });
    jest.spyOn(CoachesAPI, "updateCoachIntro").mockResolvedValue(false);
    jest.spyOn(CoachesAPI, "updateCoachSNS").mockResolvedValue(false);

    const { getByTestId, getAllByTestId } = renderWithProviders(
      <CoachProfileManagement />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("instagram"));
      fireEvent.press(getByTestId("blog"));

      fireEvent.press(getByTestId("open-intro"));
      fireEvent.press(getAllByTestId("저장")[0]);

      fireEvent.press(getByTestId("open-sns"));
      fireEvent.press(getAllByTestId("저장")[1]);
    });
  });
});
