import { Tabs } from "react-native-collapsible-tab-view";

import { CoachList } from "./CoachList/CoachList";
import { Information } from "./Information/Information";
import { NoticeList } from "./NoticeList/NoticeList";
import { ProgramList } from "./ProgramList/ProgramList";
import { ReviewList } from "./ReviewList/ReviewList";
import { CollapsibleTab } from "@components/Tabs";
import { AcademyProfile } from "@fragments/Academy";

export function AcademyDetail() {
  return (
    <Tabs.Container
      renderHeader={() => <AcademyProfile />}
      renderTabBar={(props) => <CollapsibleTab {...props} />}
      pagerProps={{ scrollEnabled: false }}
      headerContainerStyle={{ shadowOpacity: 0 }}
      initialTabName="정보"
    >
      <Tabs.Tab name="정보">
        <Tabs.ScrollView>
          <Information />
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
