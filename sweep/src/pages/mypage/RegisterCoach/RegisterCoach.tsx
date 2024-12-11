import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { ImagePickerAsset } from "expo-image-picker";

import { TextButton } from "@components/Buttons";
import { AppIcon } from "@components/Icons";
import { ImagePicker } from "@components/Pickers";
import { Scroll } from "@components/ScrollView";
import { Searchbar } from "@components/Search";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { AcademySimpleType } from "@models/products";
import { alert } from "@services/alert";
import { createCoach, getAcademies } from "@services/products";
import { ThemeColorType } from "@themes/colors";

const careerOptions = [
  "프로선수 출신",
  "독립리그 출신",
  "해외대학 출신",
  "대학선수 출신",
  "고교선수 출신",
  "트레이닝 코치",
];

const professionOptions = [
  "투수 전문",
  "타격 전문",
  "수비 전문",
  "포수 전문",
  "트레이닝 전문",
  "재활 전문",
];

export function RegisterCoach() {
  const [query, setQuery] = useState<string>("");
  const [selectedAcademy, setSelectedAcademy] = useState<AcademySimpleType>();
  const [uploadedProfile, setUploadedProfile] = useState<ImagePickerAsset[]>(
    []
  );
  const [options, setOptions] = useState<AcademySimpleType[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string>("프로선수 출신");
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([
    "투수 전문",
  ]);

  const { selectedProfile } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCareerPress = (career: string) => {
    setSelectedCareer(career);
  };

  const handleProfessionPress = (profession: string) => {
    if (selectedProfessions.includes(profession)) {
      setSelectedProfessions(
        selectedProfessions.filter((p) => p !== profession)
      );
    } else {
      setSelectedProfessions([...selectedProfessions, profession]);
    }
  };

  const handleRegisterPress = async () => {
    if (!selectedAcademy) {
      alert("등록 실패", "아카데미를 선택해주세요");
      return;
    }
    if (uploadedProfile.length === 0) {
      alert("등록 실패", "프로필 사진을 등록해주세요");
      return;
    }
    const response = await createCoach(
      selectedCareer,
      selectedAcademy.uuid,
      uploadedProfile[0],
      selectedProfessions
    );

    if (response) {
      alert("등록 성공", "코치 등록 신청이 완료되었습니다");
      router.dismissAll();
      router.push("/mypage/");
    } else {
      alert("코치 등록 실패", "코치 등록에 실패했습니다");
    }
  };

  const handleAcademySelect = (academy: AcademySimpleType) => {
    setSelectedAcademy(academy);
    setQuery("");
    setOptions([]);
  };

  const handleSearch = async () => {
    const response = await getAcademies(query);

    if (response) {
      setOptions(response.academies);
    }
  };

  useEffect(() => {
    if (query.length > 0) {
      handleSearch();
    }
  }, [query]);

  return (
    <Scroll style={styles.container}>
      <Text style={styles.title}>코치 등록</Text>
      <Text style={styles.helperText}>
        경력 인증만으로 간편하게 캐치비 코치로 참여하세요!
      </Text>
      <View style={styles.contents}>
        <View style={styles.disabledInput}>
          <Text style={styles.subtitle}>
            이름 <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.disabledText}>{selectedProfile?.name}</Text>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.subtitle}>
            경력 <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.optionContainer}>
            {careerOptions.map((career) => (
              <TouchableOpacity
                key={career}
                style={styles.option}
                onPress={() => handleCareerPress(career)}
                testID={`career-${career}`}
              >
                <AppIcon
                  icon="check-circle"
                  size={16}
                  color={
                    selectedCareer === career
                      ? theme.primary
                      : theme.lowEmphasis
                  }
                />
                <Text>{career}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.subtitle}>
            소속 아카데미 <Text style={styles.required}>*</Text>
          </Text>
          {selectedAcademy ? (
            <View style={styles.horizontal}>
              <View style={styles.selectedAcademy}>
                <AcademyMini academy={selectedAcademy} />
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setSelectedAcademy(undefined)}
                testID="reset"
              >
                <Text>변경하기</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Searchbar
              placeholder="아카데미 검색"
              value={query}
              onChange={setQuery}
            />
          )}
          {options.length > 0 ? (
            <View style={styles.menu}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.uuid}
                  onPress={() => handleAcademySelect(option)}
                  testID={`academy-${option.uuid}`}
                >
                  <AcademyMini academy={option} />
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.subtitle}>
            프로필 사진 <Text style={styles.required}>*</Text>
          </Text>
          <ImagePicker
            uploadedImages={uploadedProfile}
            setUploadedImages={setUploadedProfile}
            maxImages={1}
            description="*정면 얼굴 사진 혹은 증명사진으로 등록해주세요"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.subtitle}>
            전문 분야 (복수 가능) <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.optionContainer}>
            {professionOptions.map((profession) => (
              <TouchableOpacity
                key={profession}
                style={styles.option}
                onPress={() => handleProfessionPress(profession)}
                testID={`profession-${profession}`}
              >
                <AppIcon
                  icon="check-circle"
                  size={16}
                  color={
                    selectedProfessions.includes(profession)
                      ? theme.primary
                      : theme.lowEmphasis
                  }
                />
                <Text>{profession}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <TextButton text="등록하기" onPress={handleRegisterPress} />
      </View>
    </Scroll>
  );
}

function AcademyMini({ academy }: Readonly<{ academy: AcademySimpleType }>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.miniContainer}>
      <Image src={academy.logo} style={styles.miniImage} />
      <Text style={styles.boldText}>{academy.name}</Text>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 16,
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
    contents: {
      marginVertical: 16,
      gap: 24,
    },
    inputWrapper: {
      gap: 8,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    required: {
      fontSize: 12,
      color: "red",
    },
    disabledInput: {
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
    optionContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      width: "47.5%",
      gap: 4,
    },
    menu: {
      marginTop: -4,
      marginBottom: 8,
      borderWidth: 1,
      borderBottomWidth: 2,
      borderColor: theme.border,
      borderRadius: 4,
    },
    miniContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 4,
      paddingHorizontal: 16,
      gap: 16,
    },
    miniImage: {
      width: 24,
      height: 24,
      borderRadius: 4,
    },
    boldText: {
      fontWeight: "bold",
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
      marginBottom: 8,
    },
    selectedAcademy: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 4,
    },
    button: {
      marginLeft: 8,
      padding: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
    },
    footer: {
      marginBottom: 16,
    },
  });
