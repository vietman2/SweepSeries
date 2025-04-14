import { fireEvent, waitFor } from "@testing-library/react-native";

import { SvgIconButton, BackButton } from "./IconButton";
import { KakaoButton, NaverButton } from "./SocialButtons";
import { Link, TextButton } from "./TextButton";
import { Toggle } from "./Toggle";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Buttons");

describe("<SvgIconButton>", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <div>
        <SvgIconButton
          icon="heart-outline"
          text="좋아요 목록"
          onPress={() => {}}
          small
        />
        <SvgIconButton icon="heart" text="좋아요" onPress={() => {}} />
      </div>
    );
  });
});

describe("<BackButton>", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <BackButton onPress={jest.fn()} />
        <BackButton onPress={jest.fn()} color="red" />
      </>
    );
  });
});

describe("<KakaoButton>", () => {
  it("renders correctly", () => {
    renderWithProviders(<KakaoButton onPress={() => {}} />);
  });
});

describe("<NaverButton>", () => {
  it("renders correctly", () => {
    renderWithProviders(<NaverButton onPress={() => {}} />);
  });
});

describe("<Link>", () => {
  it("renders correctly", () => {
    renderWithProviders(<Link text="링크" onPress={() => {}} />);
  });
});

describe("<TextButton>", () => {
  it("renders correctly", () => {
    renderWithProviders(<TextButton text="텍스트 버튼" onPress={() => {}} />);
  });

  it("renders disabled button", () => {
    renderWithProviders(
      <TextButton text="텍스트 버튼" onPress={() => {}} active={false} />
    );
  });
});

describe("<Toggle>", () => {
  it("renders on correctly", () => {
    const { getByTestId } = renderWithProviders(
      <Toggle isOn={true} onToggle={jest.fn()} />
    );

    waitFor(() => fireEvent.press(getByTestId("toggle")));
  });

  it("renders off correctly", () => {
    waitFor(() =>
      renderWithProviders(<Toggle isOn={false} onToggle={jest.fn()} />)
    );
  });
});
