import styled, { DefaultTheme } from "styled-components/native";

import { Divider } from "@components/Dividers";
import { BaseModal } from "@components/Modals";
import { useTheme } from "@contexts/theme";
import { LessonDetailType } from "@models/calendar";

interface Props {
  lesson: LessonDetailType;
  newDateTime: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  lesson,
  newDateTime,
  onCancel,
  onConfirm,
}: Readonly<Props>) {
  const { theme } = useTheme();

  const originalDateTime = () => {
    const dateString = lesson.full_date; // given in YYYY년 MM월 DD일 format
    const timeString = lesson.time.split("~")[0].trim(); // get the start time

    return `${dateString} ${timeString}`;
  };

  return (
    <BaseModal>
      <Container>
        <Title>
          <GreenText>예약 변경</GreenText>을 요청하시겠습니까?
        </Title>
        <Contents>
          <Content>
            예약상품: {`${lesson.title} / ${lesson.curriculum}`}
          </Content>
          <Content>기존예약: {originalDateTime()}</Content>
          <Content>변경일시: {newDateTime}</Content>
        </Contents>
        <Divider />
        <Buttons>
          <Button onPress={onCancel} testID="cancel">
            <ButtonText>아니오</ButtonText>
          </Button>
          <Button onPress={onConfirm} testID="confirm">
            <ButtonText style={{ color: theme.primary }}>변경요청</ButtonText>
          </Button>
        </Buttons>
      </Container>
    </BaseModal>
  );
}

const Container = styled.View`
  justify-content: center;
  width: 85%;
  border-radius: 16px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background};
`;

const Title = styled.Text`
  margin-top: 24px;
  margin-bottom: 16px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.lowEmphasis};
`;

const GreenText = styled.Text`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary};
`;

const Contents = styled.View`
  margin-bottom: 36px;
  gap: 8px;
`;

const Content = styled.Text`
  padding: 0 24px;
  font-size: 14px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.mediumEmphasis};
`;

const Buttons = styled.View`
  flex-direction: row;
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.lowEmphasis};
`;
