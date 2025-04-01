import { render, waitFor } from "@testing-library/react-native";

import ScrollWithRefresh from "./ScrollWithRefresh";

jest.unmock("@components/ScrollView");

describe("<ScrollWithRefresh />", () => {
  it("renders correctly and handles scroll down with sticky", () => {
    const { getByTestId } = render(
      <ScrollWithRefresh
        refreshing={false}
        onRefresh={jest.fn()}
        stickyIndex={1}
      >
        <></>
      </ScrollWithRefresh>
    );

    const scrollView = getByTestId("scroll-view");
    waitFor(() => {
      scrollView.props.onScroll({
        nativeEvent: { contentOffset: { y: -150 } },
      });
    });
  });

  it("handles scroll with keyboard dismiss without sticky", () => {
    const { getByTestId } = render(
      <ScrollWithRefresh
        refreshing={false}
        onRefresh={jest.fn()}
        hideKeyboardOnScroll
      >
        <></>
      </ScrollWithRefresh>
    );

    const scrollView = getByTestId("scroll-view");
    waitFor(() => {
      scrollView.props.onScroll({
        nativeEvent: { contentOffset: { y: -150 } },
      });
    });
  });
});
