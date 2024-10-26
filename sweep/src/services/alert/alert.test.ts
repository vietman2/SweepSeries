import { alert } from "./alert";

describe("alert", () => {
  const onPress = jest.fn();

  it("should return Alert", () => {
    alert("title", "message");
  });

  it("should return Alert with onPress", () => {
    alert("title", "message", onPress);
  });

  it("should return Alert with custom onPressText and cancel", () => {
    alert("title", "message", onPress, "custom", true);
  });
});
