import { alert } from "./alert";

jest.unmock("@services/alert/alert");

describe("alert", () => {
  const onPress = jest.fn();

  beforeEach(() => {
  jest.restoreAllMocks();
  });

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
