import { useEffect, useState } from "react";
import { Tabs } from "react-native-collapsible-tab-view";
import { useLocalSearchParams } from "expo-router";

import { CoachList } from "./CoachList/CoachList";
import { Information } from "./Information/Information";
import { NoticeList } from "./NoticeList/NoticeList";
import { ProgramList } from "./ProgramList/ProgramList";
import { ReviewList } from "./ReviewList/ReviewList";
import { ErrorPage } from "@components/Fallbacks";
import { CollapsibleTab } from "@components/Tabs";
import { AcademyProfile } from "@fragments/Academy";
import { AcademyDetailType } from "@models/products";
import { getAcademyDetail } from "@services/products";

export function AcademyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [academy, setAcademy] = useState<AcademyDetailType>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAcademyDetail(id);

      if (response) {
        setAcademy(response);
      }
    };

    fetchData();
  }, []);

  if (!academy) return <ErrorPage />;

  return (
    <Tabs.Container
      renderHeader={() => <AcademyProfile academy={academy} />}
      renderTabBar={(props) => <CollapsibleTab {...props} />}
      pagerProps={{ scrollEnabled: false }}
      headerContainerStyle={{ shadowOpacity: 0 }}
      initialTabName="정보"
    >
      <Tabs.Tab name="정보">
        <Tabs.ScrollView>
          <Information academy={academy} />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="프로그램">
        <Tabs.ScrollView>
          <ProgramList />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="코치">
        <Tabs.ScrollView>
          <CoachList />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="소식">
        <Tabs.ScrollView>
          <NoticeList />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="리뷰">
        <Tabs.ScrollView>
          <ReviewList />
        </Tabs.ScrollView>
      </Tabs.Tab>
    </Tabs.Container>
  );
}
