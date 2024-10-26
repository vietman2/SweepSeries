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
      scrollView.props.onScrollEndDrag();

      scrollView.props.onScroll({ nativeEvent: { contentOffset: { y: -50 } } });
      scrollView.props.onScrollEndDrag();
    });
  });

  it("renders correctly without sticky and handle keyboard dismiss", () => {
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
      scrollView.props.onScrollEndDrag();

      scrollView.props.onScroll({ nativeEvent: { contentOffset: { y: -50 } } });
      scrollView.props.onScrollEndDrag();
    });
  });
});
