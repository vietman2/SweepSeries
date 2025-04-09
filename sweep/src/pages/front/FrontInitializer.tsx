import { useEffect, useState } from "react";
import { Redirect } from "expo-router";

import { ErrorPage, LoadingComponent } from "@components/Fallbacks";
import { useFront } from "@contexts/front";
import { getStorage } from "@services/storage";

export function FrontInitializer() {
  const [initialMode, setInitialMode] = useState<"academy" | "coach" | null>(
    null
  );
  const [initialUuid, setInitialUuid] = useState<string | null>(null);

  const { loading, academies, coaches } = useFront();

  useEffect(() => {
    const checkStorage = async () => {
      const frontMode = await getStorage("front_mode");
      const frontUuid = await getStorage("front_uuid");

      if (frontMode && frontUuid) {
        if (frontMode === "academy") {
          setInitialMode("academy");
          setInitialUuid(frontUuid);
        }
        if (frontMode === "coach") {
          setInitialMode("coach");
          setInitialUuid(frontUuid);
        }
      }
    };

    checkStorage();
  }, []);

  if (loading) return <LoadingComponent />;

  // 1. 가장 먼저, 로컬 스토리지에 저장된 모드 & uuid를 확인한다.
  if (initialMode && initialUuid) {
    if (initialMode === "academy") {
      return <Redirect href={`/front/academy/${initialUuid}/profile`} />;
    } else {
      return <Redirect href={`/front/coach/${initialUuid}`} />;
    }
  }

  // 2. 로컬 스토리지에 저장된 값이 없으면, academies 혹은 coaches 중 첫번째를 선택하여 redirect
  if (academies.length > 0) {
    return <Redirect href={`/front/academy/${academies[0].uuid}/profile`} />;
  }

  if (coaches.length > 0) {
    return <Redirect href={`/front/coach/${coaches[0].uuid}`} />;
  }

  return <ErrorPage />;
}
