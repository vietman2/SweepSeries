import { useEffect, useState } from "react";
import { Linking } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";

import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { SimpleModal } from "@components/Modals";
import { useCoachFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { alert } from "@services/alert";
import { updateCoachSNS } from "@services/products";
import { formatInstagramLink } from "@utils/formatters";

interface Props {
  instagram: string;
  blog: string;
}

export function CoachSNS({ instagram, blog }: Readonly<Props>) {
  return (
    <Content>
      <Subtitle>코치 SNS</Subtitle>
      <Row>
        <Left>
          <TextContent>인스타그램</TextContent>
        </Left>
        <Right>
          <TextButton
            onPress={() => Linking.openURL(instagram)}
            testID="instagram"
          >
            <AppIcon icon="instagram" size={20} color="#E1306C" />
            <TextContent>{formatInstagramLink(instagram)}</TextContent>
          </TextButton>
        </Right>
      </Row>
      <Row>
        <Left>
          <TextContent>블로그</TextContent>
        </Left>
        <Right>
          <TextButton onPress={() => Linking.openURL(blog)} testID="blog">
            <TextContent>{blog}</TextContent>
          </TextButton>
        </Right>
      </Row>
    </Content>
  );
}

export function CoachSNSEdit() {
  const [instagramInput, setInstagramInput] = useState<string>("");
  const [blogInput, setBlogInput] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { coach, refresh } = useCoachFront();
  const { theme } = useTheme();

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  const editSNS = async () => {
    const response = await updateCoachSNS(
      coach?.uuid,
      instagramInput,
      blogInput
    );

    if (response) {
      toggleModal();
      refresh();
    } else {
      alert("수정 실패", "오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (coach) {
      setInstagramInput(coach.instagram);
      setBlogInput(coach.blog);
    }
  }, [coach]);

  if (!coach) return null;

  return (
    <>
      <Container>
        <Header>
          <Subtitle>SNS</Subtitle>
          <EditButton onPress={toggleModal} testID="open-modal">
            <AppIcon icon="pencil" size={14} color={theme.primary} />
            <EditButtonText>수정</EditButtonText>
          </EditButton>
        </Header>
        <Row>
          <Left>
            <TextContent>인스타그램</TextContent>
          </Left>
          <Right>
            <TextButton
              onPress={() => Linking.openURL(coach.instagram)}
              testID="instagram"
            >
              <AppIcon icon="instagram" size={20} color="#E1306C" />
              <TextContent>{formatInstagramLink(coach.instagram)}</TextContent>
            </TextButton>
          </Right>
        </Row>
        <Row>
          <Left>
            <TextContent>블로그</TextContent>
          </Left>
          <Right>
            <TextButton
              onPress={() => Linking.openURL(coach.blog)}
              testID="blog"
            >
              <TextContent>{coach.blog}</TextContent>
            </TextButton>
          </Right>
        </Row>
      </Container>
      <SimpleModal
        title="SNS"
        buttonText="저장"
        visible={modalVisible}
        hideModal={toggleModal}
        onButtonPress={editSNS}
      >
        <ModalContainer>
          <TextContent>인스타그램</TextContent>
          <TextInput
            value={instagramInput}
            onChangeText={setInstagramInput}
            placeholder="인스타그램 링크를 입력하세요."
          />
          <TextContent>블로그</TextContent>
          <TextInput
            value={blogInput}
            onChangeText={setBlogInput}
            placeholder="블로그 링크를 입력하세요."
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

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const Left = styled.View`
  flex: 1;
`;

const Right = styled.View`
  flex: 4;
`;

const TextButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const ModalContainer = styled.View`
  margin-top: 8px;
  padding: 8px 16px;
  gap: 8px;
`;

const TextContent = styled.Text`
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.mediumEmphasis};
`;
