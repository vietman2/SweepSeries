import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

import { ErrorPage } from "@components/Fallbacks";
import { useAddLesson } from "@contexts/addlesson";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { ProgramSimple } from "@fragments/Program";
import { ProgramSimpleType } from "@models/products";
import { getProgramsByProfile } from "@services/products";

export function ProgramSelector() {
  const [programs, setPrograms] = useState<ProgramSimpleType[]>([]);
  const { selectedProgram, setProgram } = useAddLesson();
  const { selectedProfile } = useAuth();

  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getProgramsByProfile(selectedProfile?.id);

      if (response) {
        setPrograms(response);
      }
    };

    fetchData();
  }, [selectedProfile]);

  if (programs.length === 0) {
    return <ErrorPage />;
  }

  if (!selectedProgram) {
    return (
      <>
        {programs.map((program) => (
          <TouchableOpacity
            key={program.id}
            onPress={() => setProgram(program)}
            testID={`program-${program.id}`}
          >
            <ProgramSimple
              program={program}
              type="check"
              color={theme.lowEmphasis}
            />
          </TouchableOpacity>
        ))}
      </>
    );
  }

  return (
    <TouchableOpacity
      key={selectedProgram.id}
      onPress={() => setProgram(null)}
      testID={`program-${selectedProgram.id}`}
    >
      <ProgramSimple
        program={selectedProgram}
        type="check"
        color={theme.primary}
      />
    </TouchableOpacity>
  );
}
