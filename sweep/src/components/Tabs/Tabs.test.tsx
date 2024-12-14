import { configureReanimatedLogger } from "react-native-reanimated";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, waitFor } from "@testing-library/react-native";
import { Tabs } from "react-native-collapsible-tab-view";

import { CollapsibleTab } from "./CollapsibleTab";
import { FAQTabs } from "./FAQTabs";
import { TabBar } from "./Tabbar";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@react-navigation/material-top-tabs");

const Tab = createMaterialTopTabNavigator();

const MockComponent = () => <div />;

configureReanimatedLogger({
  strict: false,
});

describe("<CollapsibleTab />", () => {
  it("renders correctly", () => {
    const { getByText } = renderWithProviders(
      <Tabs.Container renderTabBar={(props) => <CollapsibleTab {...props} />}>
        <Tabs.Tab name="Tab1">
          <MockComponent />
        </Tabs.Tab>
        <Tabs.Tab name="Tab2">
          <MockComponent />
        </Tabs.Tab>
      </Tabs.Container>
    );

    fireEvent.press(getByText("Tab2"));
  });
});

describe("<FAQTabs />", () => {
  const tabs = ["tab1", "tab2", "tab3"];

  it("renders correctly", () => {
    const { getByText } = renderWithProviders(
      <FAQTabs tabs={tabs} selectedTab="tab1" setSelectedTab={jest.fn()} />
    );

    fireEvent.press(getByText("tab2"));
  });
});

describe("<TabBar />", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="example"
          tabBar={(props) => <TabBar {...props} />}
        >
          <Tab.Screen
            name="example"
            component={MockComponent}
            options={{ title: "example" }}
          />
          <Tab.Screen
            name="example2"
            component={MockComponent}
            options={{ title: "example2" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );

    waitFor(() => fireEvent.press(getByTestId("example")));
    waitFor(() => fireEvent.press(getByTestId("example2")));
    fireEvent(getByTestId("example"), "onLongPress");
  });
  
  it("renders scrollable correctly", () => {
    const { getByTestId } = renderWithProviders(
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="example"
          tabBar={(props) => <TabBar {...props} scrollable />}
        >
          <Tab.Screen
            name="example"
            component={MockComponent}
            options={{ title: "example" }}
          />
          <Tab.Screen
            name="example2"
            component={MockComponent}
            options={{ title: "example2" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );

    waitFor(() => fireEvent.press(getByTestId("example")));
    waitFor(() => fireEvent.press(getByTestId("example2")));
    fireEvent(getByTestId("example"), "onLongPress");
  });
});
