import { configureReanimatedLogger } from "react-native-reanimated";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { FAQTabs } from "./FAQTabs";
import { TabBar } from "./Tabbar";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@react-navigation/material-top-tabs");

const Tab = createMaterialTopTabNavigator();

const MockComponent = () => <div />;

configureReanimatedLogger({
  strict: false,
});

describe("<FAQTabs />", () => {
  const tabs = ["tab1", "tab2", "tab3"];

  it("renders correctly", async () => {
    const { getByText } = renderWithProviders(
      <FAQTabs tabs={tabs} selectedTab="tab1" setSelectedTab={jest.fn()} />
    );

    await waitFor(() => fireEvent.press(getByText("tab2")));
  });
});

describe("<TabBar />", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="example"
          tabBar={(props: MaterialTopTabBarProps) => <TabBar {...props} />}
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

    waitFor(() => {
      fireEvent.press(getByTestId("example"));
      fireEvent.press(getByTestId("example2"));
      fireEvent(getByTestId("example"), "onLongPress");
    });
  });

  it("renders scrollable correctly", async () => {
    const { getByTestId } = renderWithProviders(
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="example"
          tabBar={(props: MaterialTopTabBarProps) => (
            <TabBar {...props} scrollable />
          )}
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
