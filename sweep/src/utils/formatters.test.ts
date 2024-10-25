import { formatBirthDate } from "./formatters";

it("formats birth date", () => {
  expect(formatBirthDate("20201231")).toBe("2020-12-31");
  expect(formatBirthDate("2020123")).toBe("2020123");
});
