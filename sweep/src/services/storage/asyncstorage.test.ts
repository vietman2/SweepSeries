import { saveStorage, getStorage } from "./asyncstorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe("AsyncStorage", () => {
  it("should save storage", async () => {
    await saveStorage("key", "value");
  });

  it("should get storage", async () => {
    await getStorage("key");
  });
});
