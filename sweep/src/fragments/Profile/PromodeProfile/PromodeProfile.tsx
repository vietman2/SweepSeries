import styled from "styled-components/native";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";

interface ProfileProps {
  image: string;
  text: string;
}

export function SelectedProfile({ image, text }: Readonly<ProfileProps>) {
  const { theme } = useTheme();

  return (
    <Container>
      <LogoImage src={image} />
      <ProfileText>{text}</ProfileText>
      <AppIcon icon="chevron-down" size={16} color={theme.highEmphasis} />
    </Container>
  );
}

interface Props {
  image: string;
  text: string;
  selected?: boolean;
}

export function PromodeProfile({
  image,
  text,
  selected = false,
}: Readonly<Props>) {
  const { theme } = useTheme();

  return (
    <WideContainer>
      <Container>
        <LogoImage src={image} />
        <ProfileText
          style={{ color: selected ? theme.logo : theme.lowEmphasis }}
        >
          {text}
        </ProfileText>
      </Container>
      {selected && <AppIcon icon="check" size={28} color={theme.logo} />}
    </WideContainer>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const LogoImage = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 4px;
`;

const ProfileText = styled.Text`
  font-size: 22px;
  font-weight: bold;
`;

const WideContainer = styled(Container)`
  flex: 1;
  justify-content: space-between;
`;
