import { useState } from "react";
import { Keyboard, Modal, Pressable, StyleSheet, View } from "react-native";

import { TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { PopupMenu } from "@components/Menus";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

const reasonChoices: string[] = [
  "욕설/비방",
  "폭력/협박/위협",
  "음란물",
  "거짓/허위정보/사기",
  "도배/스팸/광고",
  "개인정보 침해",
  "정치적인 내용",
  "잘못된 게시판/태그",
  "기타",
];

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  content: string;
  onSubmit: (selectedReason: string, detail: string) => Promise<boolean>;
}

export function ReportModal({ visible, setVisible, content, onSubmit }: Props) {
  const [detail, setDetail] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>(
    reasonChoices[0]
  );

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const items = reasonChoices.map((reason) => ({
    label: reason,
    onPress: () => setSelectedReason(reason),
  }));

  const hideModal = () => {
    setDetail("");
    setVisible(false);
  };

  const handleSubmitPress = async () => {
    const result = await onSubmit(selectedReason, detail);

    if (result) hideModal();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <Pressable style={styles.overlay} onPress={hideModal} testID="hide" />
      <Pressable style={styles.modal} onPress={Keyboard.dismiss}>
        <Text style={styles.title}>신고하기</Text>
        <Divider />
        <View style={styles.content}>
          <PopupMenu items={items}>
            <MenuItem text={selectedReason} />
          </PopupMenu>
          <Text style={styles.grayText}>
            {
              "신고는 반대의견을 나타내는 기능이 아닙니다.\n신고 사유에 맞지 않는 신고는 처리되지 않습니다"
            }
          </Text>
          <Text style={styles.boldText}>신고 내용</Text>
          <Text style={styles.grayText} numberOfLines={1} ellipsizeMode="tail">
            {content}
          </Text>
          <TextInput
            value={detail}
            onChangeText={setDetail}
            placeholder="사유나 불편했던 점을 입력해주세요."
            multiline
          />
        </View>
        <TextButton text="신고하기" onPress={handleSubmitPress} />
      </Pressable>
    </Modal>
  );
}

function MenuItem({ text }: { text: string }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.menuitem}>
      <View style={styles.textWrapper}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <AppIcon icon="chevron-down" color={theme.lowEmphasis} size={14} />
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.25)",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      position: "absolute",
      alignSelf: "center",
      top: "25%",
      width: "85%",
      height: "40%",
      paddingBottom: 10,
      paddingHorizontal: 5,
      backgroundColor: "white",
      borderRadius: 10,
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center",
      paddingVertical: 5,
    },
    content: {
      flex: 1,
      overflow: "scroll",
      marginTop: 10,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    boldText: {
      fontWeight: "bold",
      marginTop: 10,
    },
    grayText: {
      color: "gray",
      marginTop: 5,
      marginLeft: 5,
    },
    menuitem: {
      flexDirection: "row",
      alignItems: "center",
    },
    textWrapper: {
      marginRight: 5,
      paddingVertical: 3,
      paddingHorizontal: 5,
      borderRadius: 5,
      backgroundColor: theme.border,
    },
    text: {
      fontWeight: "bold",
    },
  });
