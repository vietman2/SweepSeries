import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { NewCurriculum } from "./NewCurriculum";
import { TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { Scroll } from "@components/ScrollView";
import { CalloutSmall } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CurriculumType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  curriculums: CurriculumType[];
  closeModal: () => void;
  submit: (curriculums: CurriculumType[]) => void;
}

export function CurriculumModal({ curriculums, closeModal, submit }: Readonly<Props>) {
  const [rows, setRows] = useState<CurriculumType[]>(curriculums);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSubmit = () => {
    submit(rows);
  };

  return (
    <Modal animationType="slide" transparent visible>
      <View style={styles.backdrop}>
        <Pressable
          onPress={closeModal}
          style={StyleSheet.absoluteFill}
          testID="close-modal"
        />
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>커리큘럼 설정</Text>
            <Divider />
          </View>
          <Scroll>
            <View style={styles.content}>
              <CalloutSmall
                text={
                  "\u2022 커리큘럼의 횟수와 금액을 설정할 수 있습니다. 프로그램에 맞게 설정해보세요!"
                }
                color={theme.primary}
              />
              <Text style={styles.subtitle}>등록된 커리큘럼</Text>
              <NewCurriculum rows={rows} setRows={setRows} />
            </View>
          </Scroll>
          <View style={styles.footer}>
            <TextButton text="저장" onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
      width: 320,
      minHeight: 360,
      maxHeight: 720,
      backgroundColor: theme.background,
      paddingVertical: 8,
      borderRadius: 8,
    },
    header: {
      gap: 4,
    },
    title: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
    },
    content: {
      flex: 1,
      padding: 16,
      gap: 8,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
    footer: {
      padding: 16,
    },
  });
