import { Modal, View } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";

import { AppIcon } from "@components/Icons";

interface Props {
  message: string;
}

export function SuccessAlert({ message }: Readonly<Props>) {
  return (
    <View>
      <Modal transparent visible>
        <Overlay>
          <ModalContainer>
            <AppIcon icon="check-circle" size={50} color="green" />
            <Message>{message}</Message>
          </ModalContainer>
        </Overlay>
      </Modal>
    </View>
  );
}

const Overlay = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 1001;
`;

const ModalContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 80%;
  padding: 16px;
  gap: 16px;
  border-radius: 16px;
  background-color: white;
`;

const Message = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.mediumEmphasis};
`;
