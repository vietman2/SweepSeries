import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { SvgIconButton, TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { Scroll } from "@components/ScrollView";
import { CalloutSmall, Text } from "@components/Texts";
import { useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { CoachModal, CoachSelect } from "@fragments/Coach";
import { MultiSelect, NewCurriculum, SingleSelect } from "@fragments/Program";
import {
  CoachSimpleType,
  CurriculumType,
  OptionType,
  TeamInputType,
} from "@models/products";
import { alert } from "@services/alert";
import {
  getTargets,
  getPositions,
  createProgram,
  getCoaches,
} from "@services/products";
import { timeOptions } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function CreateProgram() {
  const [title, setTitle] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<number>(30);
  const [selectedTarget, setSelectedTarget] = useState<number>(-1);
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
  const [selectedCoaches, setSelectedCoaches] = useState<TeamInputType[]>([]);
  const [rows, setRows] = useState<CurriculumType[]>([
    { id: 1, num_lessons: 0, price: 0 },
  ]);

  const [coachOptions, setCoachOptions] = useState<CoachSimpleType[]>([]);
  const [targetOptions, setTargetOptions] = useState<OptionType[]>([]);
  const [positionOptions, setPositionOptions] = useState<OptionType[]>([]);
  const [coachSelectDisabled, setCoachSelectDisabled] =
    useState<boolean>(false);
  const [coachModal, setCoachModal] = useState<boolean>(false);

  const { uuid } = useFront();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const selectPosition = (value: number) => {
    setSelectedPositions(
      selectedPositions.includes(value)
        ? selectedPositions.filter((pos) => pos !== value)
        : [...selectedPositions, value]
    );
  };

  const toggleCoachModal = () => {
    setCoachModal(!coachModal);
  };

  const toggleCoachSelect = () => {
    setCoachSelectDisabled(!coachSelectDisabled);
  };

  const addCoachTeam = (coaches: CoachSimpleType[]) => {
    setSelectedCoaches([...selectedCoaches, { coaches }]);
    toggleCoachModal();
  };

  const removeCoachTeam = (index: number) => {
    setSelectedCoaches(selectedCoaches.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    const response = await createProgram(
      uuid,
      title,
      selectedTime,
      selectedTarget,
      selectedPositions,
      rows,
      {
        select_disabled: coachSelectDisabled,
        teams: selectedCoaches,
      }
    );

    if (response) {
      alert("성공", "프로그램이 생성되었습니다.", router.back);
    } else {
      alert("오류", "프로그램 생성 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response1 = await getTargets();
      const response2 = await getPositions();
      const response3 = await getCoaches(uuid);

      if (response1 && response2 && response3) {
        setTargetOptions(response1);
        setPositionOptions(response2);
        setCoachOptions(response3);
        setSelectedTarget(1);
        setSelectedPositions([1]);
      } else {
        alert(
          "오류 발생",
          "데이터를 불러오는 중 오류가 발생했습니다.",
          router.back
        );
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Scroll style={styles.container}>
        <View>
          <View style={styles.content}>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>프로그램 이름</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="상품명을 입력하세요."
              />
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>이용시간</Text>
              <SingleSelect
                options={timeOptions}
                selected={selectedTime}
                setSelected={setSelectedTime}
              />
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>대상</Text>
              <SingleSelect
                options={targetOptions}
                selected={selectedTarget}
                setSelected={setSelectedTarget}
              />
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>포지션</Text>
              <MultiSelect
                options={positionOptions}
                selected={selectedPositions}
                setSelected={(value) => selectPosition(value)}
              />
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>가격 정보</Text>
              <NewCurriculum rows={rows} setRows={setRows} />
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>코치 설정</Text>
              <CalloutSmall
                text={
                  "- 코치를 미리 설정하면, 수강생이 코치를 직접 선택할 수 있어요!\n- 미리 설정하지 않으려면, '임의 배정'을 선택하고 등록해주세요!"
                }
              />
              <TouchableOpacity
                style={styles.toggle}
                onPress={toggleCoachSelect}
                testID="toggle-coach-select"
              >
                <AppIcon
                  icon="check-circle"
                  size={24}
                  color={
                    coachSelectDisabled ? theme.primary : theme.lowEmphasis
                  }
                />
                <Text>임의 배정</Text>
              </TouchableOpacity>
              <View style={styles.wrapper}>
                {selectedCoaches.map((team, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      style={styles.remove}
                      onPress={() => removeCoachTeam(index)}
                      testID={`remove-coach-${index}`}
                    >
                      <AppIcon icon="close" size={18} color="red" />
                    </TouchableOpacity>
                    <View style={styles.list}>
                      {team.coaches.map((coach) => (
                        <CoachSelect key={coach.uuid} coach={coach} />
                      ))}
                    </View>
                    <Divider />
                  </View>
                ))}
              </View>
              {!coachSelectDisabled && (
                <SvgIconButton
                  icon="plus"
                  text="코치 팀 추가"
                  color={theme.primary}
                  onPress={toggleCoachModal}
                  small
                />
              )}
            </View>
          </View>
          <View style={styles.buttonWrapper}>
            <TextButton text="등록" onPress={handleCreate} />
          </View>
        </View>
      </Scroll>
      {coachModal && (
        <CoachModal
          coaches={coachOptions}
          closeModal={toggleCoachModal}
          addCoachTeam={addCoachTeam}
        />
      )}
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      gap: 16,
    },
    wrapper: {
      gap: 8,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    toggle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    list: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 4,
      paddingBottom: 8,
    },
    remove: {
      position: "absolute",
      right: 16,
      top: 16,
    },
    buttonWrapper: {
      paddingTop: 16,
      paddingBottom: 36,
    },
  });
