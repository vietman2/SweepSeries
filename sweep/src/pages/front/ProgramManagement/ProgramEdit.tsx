import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { SvgIconButton, TextButton } from "@components/Buttons";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { Scroll } from "@components/ScrollView";
import { CalloutSmall, Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CoachModal } from "@fragments/Coach";
import {
  CoachTeam,
  CurriculumModal,
  EditCurriculum,
  MultiSelect,
  SingleSelect,
} from "@fragments/Program";
import {
  CoachSimpleType,
  CurriculumType,
  ProgramSimpleType,
  OptionType,
} from "@models/products";
import { alert } from "@services/alert";
import {
  editProgram,
  getProgramDetail,
  addCoachTeam,
  deleteCoachTeam,
  saveCurriculums,
  toggleCoachSelect,
  deleteProgram,
} from "@services/products";
import { timeOptions } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function ProgramEdit() {
  const [program, setProgram] = useState<ProgramSimpleType>();

  const [title, setTitle] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<number>(30);
  const [selectedTarget, setSelectedTarget] = useState<number>(-1);
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);

  const [coachOptions, setCoachOptions] = useState<CoachSimpleType[]>([]);
  const [targetOptions, setTargetOptions] = useState<OptionType[]>([]);
  const [positionOptions, setPositionOptions] = useState<OptionType[]>([]);
  const [coachModal, setCoachModal] = useState<boolean>(false);
  const [curriculumModal, setCurriculumModal] = useState<boolean>(false);

  const [refreshCount, setRefreshCount] = useState<number>(0);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const selectPosition = (value: number) => {
    setSelectedPositions(
      selectedPositions.includes(value)
        ? selectedPositions.filter((pos) => pos !== value)
        : [...selectedPositions, value]
    );
  };

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const toggleCoachModal = () => {
    setCoachModal(!coachModal);
  };

  const toggleCurriculumModal = () => {
    setCurriculumModal(!curriculumModal);
  };

  const toggleSelect = async () => {
    const response = await toggleCoachSelect(program?.id);

    if (response) {
      handleRefresh();
    } else {
      alert("코치 설정 실패", "코치 설정을 변경하는데 실패했습니다.");
    }
  };

  const handleAddTeam = async (coaches: CoachSimpleType[]) => {
    const response = await addCoachTeam(
      program?.id,
      coaches.map((c) => c.uuid)
    );

    if (response) {
      toggleCoachModal();
      handleRefresh();
    } else {
      alert("코치 팀 추가 실패", "코치 팀 추가에 실패했습니다.");
    }
  };

  const removeTeam = async (index: number) => {
    const response = await deleteCoachTeam(program?.id, index);

    if (response) {
      handleRefresh();
    } else {
      alert("코치 팀 삭제 실패", "코치 팀 삭제에 실패했습니다.");
    }
  };

  const handleSaveCurriculums = async (curriculums: CurriculumType[]) => {
    const response = await saveCurriculums(program?.id, curriculums);

    if (response) {
      toggleCurriculumModal();
      handleRefresh();
    } else {
      alert("커리큘럼 저장 실패", "커리큘럼 저장에 실패했습니다.");
    }
  };

  const handleEdit = async () => {
    const response = await editProgram(
      program?.id,
      title,
      selectedTime,
      selectedTarget,
      selectedPositions
    );

    if (response) {
      router.back();
    } else {
      alert("프로그램 수정 실패", "프로그램 수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    const response = await deleteProgram(program?.id);

    if (response) {
      router.back();
    } else {
      alert("삭제 실패", "프로그램 삭제에 실패했습니다.");
    }
  };

  const confirmDelete = () => {
    alert("삭제 확인", "정말 삭제하시겠습니까?", handleDelete, "삭제", true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getProgramDetail(id);

      if (response) {
        setProgram(response.program);
        setTargetOptions(response.targets);
        setPositionOptions(response.positions);
        setCoachOptions(response.coaches);
      } else {
        alert(
          "프로그램 불러오기 실패",
          "프로그램 정보를 불러오는데 실패했습니다.",
          router.back
        );
      }
    };

    fetchData();
  }, [id, refreshCount]);

  useEffect(() => {
    if (program) {
      setTitle(program.name);
      setSelectedTime(program.duration);
      setSelectedTarget(program.target.id);
      setSelectedPositions(program.positions.map((pos: OptionType) => pos.id));
    }
  }, [program]);

  if (!program) {
    return null;
  }

  return (
    <>
      <Scroll style={styles.container}>
        <View>
          <View style={styles.content}>
            <View style={styles.box}>
              <Text style={styles.title}>프로그램 이름</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="상품명을 입력하세요."
              />
            </View>
            <View style={styles.box}>
              <Text style={styles.title}>이용시간</Text>
              <SingleSelect
                options={timeOptions}
                selected={selectedTime}
                setSelected={setSelectedTime}
              />
            </View>
            <View style={styles.box}>
              <Text style={styles.title}>대상</Text>
              <SingleSelect
                options={targetOptions}
                selected={selectedTarget}
                setSelected={setSelectedTarget}
              />
            </View>
            <View style={styles.box}>
              <Text style={styles.title}>포지션</Text>
              <MultiSelect
                options={positionOptions}
                selected={selectedPositions}
                setSelected={(value) => selectPosition(value)}
              />
            </View>
            <View style={styles.box}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>가격 정보</Text>
                <TouchableOpacity
                  style={styles.headerRow}
                  onPress={toggleCurriculumModal}
                  testID="open-curriculum-modal"
                >
                  <AppIcon icon="pencil" size={14} color={theme.primary} />
                  <Text style={styles.greenText}>수정</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.curriculums}>
                <EditCurriculum curriculums={program.curriculums} />
              </View>
            </View>
            <View style={styles.box}>
              <Text style={styles.title}>코치 설정</Text>
              <CalloutSmall
                text={
                  "- 코치를 미리 설정하면, 수강생이 코치를 직접 선택할 수 있어요!\n- 미리 설정하지 않으려면, '임의 배정'을 선택하고 등록해주세요!"
                }
              />
              <TouchableOpacity
                style={styles.toggle}
                onPress={toggleSelect}
                testID="toggle-coach-select"
              >
                <AppIcon
                  icon="check-circle"
                  size={24}
                  color={
                    program.random_assignment
                      ? theme.primary
                      : theme.lowEmphasis
                  }
                />
                <Text>임의 배정</Text>
              </TouchableOpacity>
              {!program.random_assignment && (
                <>
                  <View style={styles.box}>
                    {program.teams.map((team) => (
                      <CoachTeam
                        key={team.id}
                        team={team}
                        onPress={() => removeTeam(team.id)}
                      />
                    ))}
                  </View>
                  <SvgIconButton
                    icon="plus"
                    text="코치 팀 추가"
                    color={theme.primary}
                    onPress={toggleCoachModal}
                    small
                  />
                </>
              )}
            </View>
          </View>
          <View style={styles.buttonWrapper}>
            <TextButton text="저장" onPress={handleEdit} />
            <TextButton
              text="삭제"
              onPress={confirmDelete}
              backgroundColor="red"
            />
          </View>
        </View>
      </Scroll>
      {coachModal && (
        <CoachModal
          coaches={coachOptions}
          closeModal={toggleCoachModal}
          addCoachTeam={handleAddTeam}
        />
      )}
      {curriculumModal && (
        <CurriculumModal
          curriculums={program.curriculums}
          closeModal={toggleCurriculumModal}
          submit={handleSaveCurriculums}
        />
      )}
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 16,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      gap: 16,
    },
    box: {
      gap: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    toggle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    buttonWrapper: {
      paddingTop: 16,
      paddingBottom: 36,
      gap: 8,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 4,
    },
    curriculums: {
      width: "70%",
    },
    greenText: {
      color: theme.primary,
    },
  });
