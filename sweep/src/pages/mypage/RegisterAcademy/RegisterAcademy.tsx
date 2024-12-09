import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { ImagePickerAsset } from "expo-image-picker";
import PostCode from "@actbase/react-daum-postcode";
import { OnCompleteParams } from "@actbase/react-daum-postcode/lib/types";

import { TextButton } from "@components/Buttons";
import { TextInput } from "@components/Inputs";
import { ImagePicker } from "@components/Pickers";
import { Scroll } from "@components/ScrollView";
import { SearchAddress } from "@components/Search";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { alert } from "@services/alert";
import { createAcademy } from "@services/products";
import { ThemeColorType } from "@themes/colors";
import {
  formatPhoneNumberText,
  formatRegistrationNumber,
} from "@utils/formatters";

export function RegisterAcademy() {
  const [academyName, setAcademyName] = useState<string>("");
  const [academyPhone, setAcademyPhone] = useState<string>("");
  const [regCode, setRegCode] = useState<string>("");
  const [uploadedCerti, setUploadedCerti] = useState<ImagePickerAsset[]>([]);
  const [uploadedLogo, setUploadedLogo] = useState<ImagePickerAsset[]>([]);
  const [addressData, setAddressData] = useState<OnCompleteParams | null>(null);
  const [address2, setAddress2] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { selectedProfile } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleError = () => {
    alert("주소 검색 오류", "주소 검색 중 오류가 발생했습니다.");
  };

  const handleAddressSelected = async (data: OnCompleteParams) => {
    setAddressData(data);
    setModalVisible(false);
  };

  const handleAddressSearchPress = () => {
    setModalVisible(true);
  };

  const handlePhoneNumberChange = (text: string) => {
    const formattedText = formatPhoneNumberText(text, academyPhone);
    setAcademyPhone(formattedText);
  };

  const handleRegCodeChange = (text: string) => {
    const formattedText = formatRegistrationNumber(text);
    setRegCode(formattedText);
  };

  const handleRegisterPress = async () => {
    if (uploadedCerti.length === 0 || uploadedLogo.length === 0) {
      alert(
        "이미지 업로드 필요",
        "사업자 등록증과 로고를 업로드해주세요."
      );
      return;
    }

    const response = await createAcademy(academyName, academyPhone, regCode, uploadedCerti[0], uploadedLogo[0], {
        road_address_part1: addressData?.address || "",
        road_address_part2: address2,
        building_name: addressData?.buildingName || "",
        zip_code: addressData?.zonecode || "",
        bcode: addressData?.bcode || "",
    });
    
    if (response) {
      alert("아카데미 등록 성공", "아카데미 등록이 완료되었습니다.");
      router.dismissAll();
      router.push("/mypage/");
    } else {
      alert("아카데미 등록 실패", "아카데미 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Scroll style={styles.container}>
        <Text style={styles.title}>아카데미 등록</Text>
        <Text style={styles.helperText}>
          간편하게 캐치비 아카데미로 참여하세요!
        </Text>
        <View style={styles.contents}>
          <View style={styles.inputWrapper}>
            <Text style={styles.subtitle}>
              아카데미 이름 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={academyName}
              onChangeText={setAcademyName}
              placeholder="아카데미 이름을 입력해주세요."
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.subtitle}>
              아카데미 연락처 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={academyPhone}
              onChangeText={handlePhoneNumberChange}
              placeholder="아카데미 전화번호를 입력해주세요."
              type="phone-pad"
            />
          </View>
          <Text style={styles.subtitle}>
            사업자 등록번호 <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            value={regCode}
            onChangeText={handleRegCodeChange}
            placeholder="사업자 등록번호를 입력해주세요."
            type="phone-pad"
          />
          <Text style={styles.subtitle}>
            사업자 등록증 <Text style={styles.required}>*</Text>
          </Text>
          <ImagePicker
            uploadedImages={uploadedCerti}
            setUploadedImages={setUploadedCerti}
            maxImages={1}
            imageOnly
          />
          <Text style={styles.subtitle}>
            아카데미 주소 <Text style={styles.required}>*</Text>
          </Text>
          <SearchAddress
            address1={addressData?.address}
            address2={address2}
            onChangeText={setAddress2}
            onButtonPress={handleAddressSearchPress}
          />
          <View style={styles.disabledInput}>
            <Text style={styles.subtitle}>대표자 이름</Text>
            <Text style={styles.disabledText}>{selectedProfile?.name}</Text>
          </View>
          <Text style={styles.subtitle}>
            아카데미 로고 <Text style={styles.required}>*</Text>
          </Text>
          <ImagePicker
            uploadedImages={uploadedLogo}
            setUploadedImages={setUploadedLogo}
            maxImages={1}
            description={
              "*아카데미를 나타낼 수 있는 로고를 등록해주세요\n*아카데미 로고는 프로필 사진으로 자동 설정됩니다.\n*이미지 용량은 20MB 이하 파일만 가능합니다."
            }
          />
          {/*<Terms setAllTermsChecked={setAllTermsChecked} />*/}
        </View>
        <TextButton text="등록하기" onPress={handleRegisterPress} />
      </Scroll>
      <Modal animationType="fade" visible={modalVisible}>
        <View style={styles.modal}>
          <PostCode
            style={styles.postcode}
            jsOptions={{
              animation: true,
              hideEngBtn: true,
              hideMapBtn: true,
            }}
            onSelected={(data) => handleAddressSelected(data)}
            onError={handleError}
          />
        </View>
      </Modal>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 16,
    },
    contents: {
      marginVertical: 16,
    },
    modal: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 36,
    },
    postcode: {
      width: "100%",
      height: "90%",
    },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.25)",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    helperText: {
      fontSize: 14,
      color: theme.lowEmphasis,
      marginTop: 8,
    },
    inputWrapper: {
      marginVertical: 4,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    disabledInput: {
      marginVertical: 16,
      gap: 8,
    },
    disabledText: {
      padding: 8,
      fontSize: 16,
      color: theme.lowEmphasis,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 4,
    },
    required: {
      fontSize: 12,
      color: "red",
    },
  });
