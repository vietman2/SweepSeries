import { createContext, useContext, useMemo, useState } from "react";
import { router } from "expo-router";

import {
  CoachSimpleType,
  ProgramSimpleType,
  StudentSimpleType,
  StudentInputType,
  CurriculumType,
} from "@models/products";
import { alert } from "@services/alert";
import { createLesson } from "@services/calendar";

interface AddLessonContextType {
  selectedProgram: ProgramSimpleType | null;
  selectedStudent: StudentInputType | null;
  selectedCurriculum: CurriculumType | null;
  selectedCoaches: CoachSimpleType[];
  selectedStartDateTime: Date;
  setProgram: (program: ProgramSimpleType | null) => void;
  setStudent: (student: StudentSimpleType | null) => void;
  setStudentTemp: (name: string, phone: string) => void;
  setSelectedCurriculum: (curriculum: CurriculumType | null) => void;
  addCoach: (coach: CoachSimpleType) => void;
  setSelectedStartDateTime: (date: Date) => void;
  handleSubmit: () => void;
}

const AddLessonContext = createContext<AddLessonContextType | undefined>(
  undefined
);

export const AddLessonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedProgram, setSelectedProgram] =
    useState<ProgramSimpleType | null>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentInputType | null>(null);
  const [selectedCurriculum, setSelectedCurriculum] =
    useState<CurriculumType | null>(null);
  const [selectedCoaches, setSelectedCoaches] = useState<CoachSimpleType[]>([]);
  const [selectedStartDateTime, setSelectedStartDateTime] = useState<Date>(
    new Date()
  );

  const setProgram = (program: ProgramSimpleType | null) => {
    if (program) {
      setSelectedProgram(program);
    } else {
      setSelectedProgram(null);
      setSelectedStudent(null);
      setSelectedCurriculum(null);
      setSelectedCoaches([]);
    }
  };

  const setStudent = (student: StudentSimpleType | null) => {
    if (student) {
      setSelectedStudent({
        id: student.id,
        name: student.name,
        phone: student.phone_number,
      });
    } else {
      setSelectedStudent(null);
      setSelectedCoaches([]);
      setSelectedCurriculum(null);
    }
  };

  const setStudentTemp = (name: string, phone: string) => {
    setSelectedStudent({
      id: -1,
      name,
      phone,
    });
  };

  const handleCoachPress = (coach: CoachSimpleType) => {
    setSelectedCoaches((prev) => {
      if (prev.find((prevCoach) => prevCoach.uuid === coach.uuid)) {
        return prev.filter((prevCoach) => prevCoach.uuid !== coach.uuid);
      } else {
        return [...prev, coach];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedCoaches.length === 0) {
      alert("오류 발생", "코치를 선택해주세요.");
      return;
    }

    if (!selectedStudent) {
      alert("오류 발생", "수강생을 선택해주세요.");
      return;
    }

    if (!selectedProgram) {
      alert("오류 발생", "프로그램을 선택해주세요.");
      return;
    }

    if (!selectedCurriculum) {
      alert("오류 발생", "커리큘럼을 선택해주세요.");
      return;
    }

    const response = await createLesson(
      selectedProgram.id,
      selectedCoaches.map((coach) => coach.uuid),
      selectedStartDateTime,
      selectedStudent,
      selectedCurriculum
    );

    if (response) {
      router.back();
    } else {
      alert("오류 발생", "일정 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const value = useMemo(
    () => ({
      selectedProgram,
      selectedStudent,
      selectedCurriculum,
      selectedCoaches,
      selectedStartDateTime,
      setProgram,
      setStudent,
      setStudentTemp,
      setSelectedCurriculum,
      addCoach: handleCoachPress,
      setSelectedStartDateTime,
      handleSubmit,
    }),
    [
      selectedProgram,
      selectedStudent,
      selectedCurriculum,
      selectedCoaches,
      selectedStartDateTime,
    ]
  );

  return (
    <AddLessonContext.Provider value={value}>
      {children}
    </AddLessonContext.Provider>
  );
};

export const useAddLesson = () => {
  const context = useContext(AddLessonContext);

  if (!context) {
    throw new Error("useAddLesson must be used within a AddLessonProvider");
  }
  return context;
};
