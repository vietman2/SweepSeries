import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { fireEvent } from "@testing-library/react-native";

import { TabBar } from "./Tabbar";
import { renderWithProviders } from "@utils/test-utils";

const Tab = createMaterialTopTabNavigator();

const MockComponent = () => <></>;

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

    fireEvent.press(getByTestId("example"));
    fireEvent.press(getByTestId("example2"));
    fireEvent(getByTestId("example"), "onLongPress");
  });
});
