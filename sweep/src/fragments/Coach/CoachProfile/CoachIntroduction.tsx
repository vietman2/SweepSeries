import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextLayoutEventData } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";

import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { SimpleModal } from "@components/Modals";
import { CalloutSmall } from "@components/Texts";
import { useCoachFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { alert } from "@services/alert";
import { updateCoachIntro } from "@services/products";

interface Props {
  introduction: string;
}

export function CoachIntroduction({ introduction }: Readonly<Props>) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showToggle, setShowToggle] = useState<boolean>(false);

  const { theme } = useTheme();

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const lines = e.nativeEvent.lines.length;

    if (lines > 5) {
      setShowToggle(true);
    }
  };

  return (
    <Content>
      <Subtitle>코치 소개</Subtitle>
      <Introduction
        numberOfLines={!isExpanded ? 5 : 0}
        onTextLayout={handleTextLayout}
        testID="introduction"
      >
        {introduction}
      </Introduction>
      {showToggle && (
        <ExpandButton onPress={toggleExpand} testID={isExpanded ? "collapse" : "expand"}>
          <AppIcon
            icon={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.lowEmphasis}
          />
        </ExpandButton>
      )}
    </Content>
  );
}

export function CoachIntroductionEdit() {
  const [introInput, setIntroInput] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { coach, refresh } = useCoachFront();
  const { theme } = useTheme();

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  useEffect(() => {
    if (coach) {
      setIntroInput(coach.introduction);
    }
  }, [coach]);

  if (!coach) return null;

  const editIntro = async () => {
    const response = await updateCoachIntro(coach.uuid, introInput);

    if (response) {
      toggleModal();
      refresh();
    } else {
      alert("수정 실패", "오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Container>
        <Header>
          <Subtitle>코치 소개</Subtitle>
          <EditButton onPress={toggleModal} testID="open-intro">
            <AppIcon icon="pencil" size={14} color={theme.primary} />
            <EditButtonText>수정</EditButtonText>
          </EditButton>
        </Header>
        <Introduction>{coach.introduction}</Introduction>
      </Container>
      <SimpleModal
        title="코치 소개글 수정"
        buttonText="저장"
        visible={modalVisible}
        hideModal={toggleModal}
        onButtonPress={editIntro}
      >
        <ModalContainer>
          <CalloutSmall text={"코치님을 소개해주세요!!"} />
          <TextInput
            value={introInput}
            onChangeText={setIntroInput}
            placeholder="소개글을 입력하세요."
            multiline
          />
        </ModalContainer>
      </SimpleModal>
    </>
  );
}

const Content = styled.View`
  padding: 0 8px;
  gap: 8px;
`;

const Container = styled.View`
  padding: 0 4px;
  gap: 16px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Subtitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.highEmphasis};
`;

const ExpandButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const EditButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const EditButtonText = styled.Text`
  text-align-vertical: center;
  font-size: 16px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary};
`;

const Introduction = styled.Text`
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.mediumEmphasis};
`;

const ModalContainer = styled.View`
  margin-top: 8px;
  padding: 8px 16px;
  gap: 8px;
`;
