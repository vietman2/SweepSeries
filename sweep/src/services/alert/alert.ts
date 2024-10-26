import { Alert } from "react-native";

export function alert(
  title: string,
  message: string,
  onPress?: () => void,
  onPressText: string = "확인",
  cancel = false
) {
  type ButtonType = {
    text: string;
    style: "default" | "cancel" | "destructive";
    onPress?: () => void;
  };

  const buttons: ButtonType[] = [];

  if (onPress) {
    buttons.push({
      text: onPressText,
      style: "default",
      onPress: onPress,
    });
  }

  if (cancel) {
    buttons.push({
      text: "취소",
      style: "cancel",
    });
  }

  return Alert.alert(title, message, buttons);
}
