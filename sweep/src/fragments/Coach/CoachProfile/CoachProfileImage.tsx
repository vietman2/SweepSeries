import { useState } from "react";
import { View } from "react-native";
import { launchImageLibraryAsync } from "expo-image-picker";
import styled, { DefaultTheme } from "styled-components/native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { BaseModalWithDismiss } from "@components/Modals";
import { useCoachFront, useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { CoachDetailType } from "@models/products";
import { alert } from "@services/alert";
import { updateCoachProfileImage } from "@services/products";

interface Props {
  coach: CoachDetailType;
}

export function CoachProfileImage({ coach }: Readonly<Props>) {
  return (
    <Profile>
      <ProfileImage src={coach.profile_image} />
    </Profile>
  );
}

export function CoachProfileImageEdit({ coach }: Readonly<Props>) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { refreshProfile } = useFront();
  const { refresh } = useCoachFront();
  const { theme } = useTheme();

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  const openImagePicker = async () => {
    const result = await launchImageLibraryAsync({
      allowsMultipleSelection: false,
    });

    if (result.canceled) return;

    const logo = result.assets[0];

    const response = await updateCoachProfileImage(coach.uuid, logo);

    if (response) {
      refresh();
      refreshProfile();
      toggleModal();
    } else {
      alert("프로필 사진 변경 실패", "프로필 사진 변경에 실패했습니다.");
    }
  };

  return (
    <>
      <Container>
        <View>
          <ProfileImage src={coach.profile_image} />
          <EditButton
            onPress={toggleModal}
            activeOpacity={0.75}
            testID="open-modal"
          >
            <AppIcon icon="pencil" size={16} color={theme.primary} />
          </EditButton>
        </View>
      </Container>
      {modalVisible && (
        <BaseModalWithDismiss onDismiss={toggleModal}>
          <ModalContainer>
            <ModalTitle>프로필 사진 변경</ModalTitle>
            <HeaderRow>
              <Subtitle style={{ fontWeight: "bold" }}>프로필 사진</Subtitle>
              <ChangeButton onPress={openImagePicker} testID="change-profile">
                <AppIcon icon="plus" size={18} color={theme.primary} />
                <Subtitle>사진 변경</Subtitle>
              </ChangeButton>
            </HeaderRow>
            <ImagePreview source={{ uri: coach.profile_image }} />
            <Divider />
            <BackButton onPress={toggleModal} testID="close">
              <BackButtonText>돌아가기</BackButtonText>
            </BackButton>
          </ModalContainer>
        </BaseModalWithDismiss>
      )}
    </>
  );
}

const Profile = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const ProfileImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 75px;
`;

const Container = styled.View`
  position: relative;
  align-items: center;
`;

const EditButton = styled.TouchableOpacity`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.backgroundGray};
  border-radius: 24px;
  padding: 8px;
`;

const ModalContainer = styled.View`
  justify-content: center;
  width: 75%;
  border-radius: 16px;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background};
`;

const ModalTitle = styled.Text`
  padding-top: 16px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary};
`;

const ChangeButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const ImagePreview = styled.Image`
  align-self: center;
  margin-bottom: 16px;
  width: 60px;
  height: 60px;
  border-radius: 8px;
`;

const BackButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: 8px 0;
`;

const BackButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.lowEmphasis};
`;
