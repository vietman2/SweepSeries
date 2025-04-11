import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SvgCssUri } from "react-native-svg/css";
import { useLocalSearchParams } from "expo-router";

import { AppIcon } from "@components/Icons";
import { SimpleModal } from "@components/Modals";
import { useTheme } from "@contexts/theme";
import { FacilityType } from "@models/products";
import { alert } from "@services/alert";
import { updateFacilities } from "@services/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  facilities: FacilityType[];
  options: FacilityType[];
  type: "구비장비" | "편의시설";
  edit?: boolean;
  onRefresh?: () => void;
}

export function Facilities({
  facilities,
  options,
  type,
  edit = false,
  onRefresh,
}: Readonly<Props>) {
  const [selectedFacilities, setSelectedFacilities] = useState<FacilityType[]>(
    []
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const facilitiesToDisplay = facilities.filter(
    (facility) => facility.type === type
  );
  const optionsToDisplay = options.filter((facility) => facility.type === type);

  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const hideModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const handleFacilityPress = async (facility: FacilityType) => {
    if (selectedFacilities.some((f) => f.id === facility.id)) {
      setSelectedFacilities((prev) => prev.filter((f) => f.id !== facility.id));
    } else {
      setSelectedFacilities((prev) => [...prev, facility]);
    }
  };

  const editFacility = async () => {
    const response = await updateFacilities(
      id,
      selectedFacilities.map((f) => f.id)
    );

    if (response) {
      hideModal();
      if (onRefresh) {
        onRefresh();
      }
    } else {
      alert("저장 실패", "시설 정보를 수정하는데 실패했습니다.");
    }
  };

  useEffect(() => {
    setSelectedFacilities(facilities);
  }, [facilities]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            {type === "구비장비" ? "구비시설" : "편의시설 및 서비스"}
          </Text>
          {edit && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={openModal}
              testID="open"
            >
              <AppIcon icon="pencil" size={12} color={theme.primary} />
              <Text style={styles.editText}>수정</Text>
            </TouchableOpacity>
          )}
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
        <View style={styles.modal}>
          {optionsToDisplay.map((facility) => (
            <TouchableOpacity
              key={facility.id}
              style={[
                styles.facilityChoice,
                selectedFacilities.some((f) => f.id === facility.id) && {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => handleFacilityPress(facility)}
              testID={`${facility.kor_name}-choice`}
            >
              <Text
                style={[
                  styles.choiceText,
                  selectedFacilities.some((f) => f.id === facility.id) && {
                    color: theme.background,
                    fontWeight: "bold",
                  },
                ]}
              >
                {facility.kor_name}
              </Text>
              {selectedFacilities.some((f) => f.id === facility.id) && (
                <AppIcon icon="check" size={14} color={theme.background} />
              )}
            </TouchableOpacity>
          ))}
        </View>
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
    modal: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      gap: 12,
    },
    facilityChoice: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "47.5%",
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: theme.border,
    },
    choiceText: {
      fontSize: 14,
    },
  });
