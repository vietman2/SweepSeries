import { useEffect, useState } from "react";
import { Redirect } from "expo-router";

import { ErrorPage } from "@components/Fallbacks";
import { getMyAcademies } from "@services/products";

export default function Front() {
  const [academyId, setAcademyId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMyAcademies();

      if (response) {
        setAcademyId(response.academies[0]);
      }
    };

    fetchData();
  }, []);

  if (academyId) {
    return <Redirect href={`/front/academy/${academyId}`} />;
  }

  return <ErrorPage />;
}
