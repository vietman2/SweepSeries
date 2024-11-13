import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { SimpleModal } from "@components/Modals";
import { useTheme } from "@contexts/theme";
import { WorkingHoursType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  workingHours: WorkingHoursType[];
}

export function WorkingHours({ workingHours }: Readonly<Props>) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const hideModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const editWorkingHours = async () => {
    hideModal();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>운영시간</Text>
          <TouchableOpacity style={styles.editButton} onPress={openModal} testID="open">
            <AppIcon icon="pencil" size={12} color={theme.primary} />
            <Text style={styles.editText}>수정</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.hours}>
          {workingHours.map((workingHour) => (
            <View key={workingHour.label} style={styles.row}>
              <Text style={styles.workingHoursTitle}>{workingHour.label}</Text>
              <Text style={styles.workingHours}>{workingHour.hours}</Text>
            </View>
          ))}
        </View>
      </View>
      <SimpleModal
        title="운영시간"
        buttonText="저장"
        visible={modalVisible}
        hideModal={hideModal}
        onButtonPress={editWorkingHours}
      >
        <View style={styles.body}></View>
      </SimpleModal>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      gap: 16,
    },
    row: {
      flexDirection: "row",
    },
    workingHoursTitle: {
      flex: 2,
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    workingHours: {
      flex: 7,
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    hours: {
      gap: 4,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    editText: {
      fontSize: 16,
      color: theme.primary,
      textAlignVertical: "center",
    },
    body: {},
  });
