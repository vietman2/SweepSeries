import { NoticeList } from "./NoticeList";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Notice", () => ({
  NoticeSimple: () => <></>,
}));

describe("<NoticeList />", () => {
  it("renders correctly", () => {
    renderWithProviders(<NoticeList />);
  });
});
