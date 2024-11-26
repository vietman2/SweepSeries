import * as SecureStore from "expo-secure-store";

import { saveSecure, getSecure, removeSecure } from "./secure";

describe("secure", () => {
  it("saves data", async () => {
    jest
      .spyOn(SecureStore, "setItemAsync")
      .mockImplementationOnce(() => Promise.resolve());
    await saveSecure("key", "value");
  });

  it("gets data", async () => {
    jest
      .spyOn(SecureStore, "getItemAsync")
      .mockImplementationOnce(() => Promise.resolve("value"));
    await getSecure("key");
  });

  it("removes data", async () => {
    jest
      .spyOn(SecureStore, "deleteItemAsync")
      .mockImplementationOnce(() => Promise.resolve());
    await removeSecure("key");
  });
});
