import { View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";

import { CoachList } from "./CoachList/CoachList";
import { Information } from "./Information/Information";
import { NoticeList } from "./NoticeList/NoticeList";
import { ProgramList } from "./ProgramList/ProgramList";
import { CollapsibleTab } from "@components/Tabs";
import { Text } from "@components/Texts";
import { AcademyProfile } from "@fragments/Academy";

function SampleComponent() {
  return (
    <View style={{ backgroundColor: "red" }}>
      <Text>asdf</Text>
    </View>
  );
}

export function AcademyDetail() {
  return (
    <Tabs.Container
      renderHeader={() => <AcademyProfile />}
      renderTabBar={(props) => <CollapsibleTab {...props} />}
      pagerProps={{ scrollEnabled: false }}
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
        <SampleComponent />
      </Tabs.Tab>
    </Tabs.Container>
  );
}
