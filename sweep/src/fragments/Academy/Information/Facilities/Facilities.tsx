import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

import { AppIcon } from "@components/Icons";
import { SimpleModal } from "@components/Modals";
import { useTheme } from "@contexts/theme";
import { FacilityType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  facilities: FacilityType[];
  type: "구비장비" | "편의시설";
}

export function Facilities({ facilities, type }: Readonly<Props>) {
  //const [options, setOptions] = useState<FacilityType[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const facilitiesToDisplay = facilities.filter(
    (facility) => facility.type === type
  );

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const hideModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const editFacility = async () => {
    hideModal();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            {type === "구비장비" ? "구비시설" : "편의시설 및 서비스"}
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={openModal} testID="open">
            <AppIcon icon="pencil" size={12} color={theme.primary} />
            <Text style={styles.editText}>수정</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.facilities}>
          {facilitiesToDisplay.map((facility) => (
            <View key={facility.id} style={styles.facilityIcon}>
              <SvgCssUri
                uri={facility.icon_url}
                width={24}
                height={24}
                color={theme.highEmphasis}
              />
              <Text style={styles.facilityText}>{facility.kor_name}</Text>
            </View>
          ))}
        </View>
      </View>
      <SimpleModal
        title={type}
        buttonText="저장"
        visible={modalVisible}
        hideModal={hideModal}
        onButtonPress={editFacility}
        large={type === "편의시설"}
      >
        <View style={styles.modal}></View>
      </SimpleModal>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    facilities: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      marginVertical: 4,
      gap: 2,
    },
    facilityIcon: {
      width: 55,
      height: 55,
      alignItems: "center",
      justifyContent: "center",
    },
    facilityText: {
      marginTop: 8,
      color: theme.lowEmphasis,
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
    modal: {},
  });
