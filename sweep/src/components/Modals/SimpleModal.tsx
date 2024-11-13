import { Keyboard, Modal, Pressable, StyleSheet, View } from "react-native";

import { TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { Text } from "@components/Texts";

interface Props {
  title: string;
  buttonText: string;
  children: React.ReactNode;
  visible: boolean;
  hideModal: () => void;
  onButtonPress: () => void;
  large?: boolean;
}

export function SimpleModal({
  title,
  children,
  buttonText,
  visible,
  hideModal,
  onButtonPress,
  large = false,
}: Readonly<Props>) {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <Pressable style={styles.overlay} onPress={hideModal} testID="hide" />
      <Pressable style={[styles.modal, large ? {top: "20%", height: "60%"} : {top: "25%", height: "40%"}]} onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Divider />
          {children}
        </View>
        <View style={styles.button}>
          <TextButton text={buttonText} onPress={onButtonPress} />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  modal: {
    position: "absolute",
    alignSelf: "center",
    width: "85%",
    backgroundColor: "white",
    borderRadius: 10,
  },
  textinput: {
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 7.5,
  },
  content: {
    flex: 1,
  },
  button: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});
