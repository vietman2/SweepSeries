import { Modal, View } from "react-native";
import styled from "styled-components/native";

interface Props {
  children: React.ReactNode;
}

export function BaseModal({ children }: Readonly<Props>) {
  return (
    <View>
      <Modal transparent visible animationType="slide" hardwareAccelerated>
        <Overlay>{children}</Overlay>
      </Modal>
    </View>
  );
}

interface PropsWithDismiss {
  children: React.ReactNode;
  onDismiss: () => void;
}

export function BaseModalWithDismiss({
  children,
  onDismiss,
}: Readonly<PropsWithDismiss>) {
  return (
    <View>
      <Container transparent visible animationType="slide">
        <PressableOverlay onPress={onDismiss} testID="hide">
          {children}
        </PressableOverlay>
      </Container>
    </View>
  );
}

const Container = styled.Modal`
  z-index: 100;
`;

const Overlay = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);
`;

const PressableOverlay = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);
`;
