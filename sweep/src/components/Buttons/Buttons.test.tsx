import { SvgIconButton } from "./IconButton";
import { KakaoButton, NaverButton } from "./SocialButtons";
import { Link, TextButton } from "./TextButton";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Buttons");

describe("<SvgIconButton>", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <SvgIconButton
        icon="heart-outline"
        text="좋아요 목록"
        onPress={() => {}}
      />
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
