import {
  formatBirthDate,
  formatPhoneNumberText,
  formatRegistrationNumber,
} from "./formatters";

it("formats birth date", () => {
  expect(formatBirthDate("20201231")).toBe("2020-12-31");
  expect(formatBirthDate("2020123")).toBe("2020123");
});

it("formats phone number text", () => {
  expect(formatPhoneNumberText("01012341234", "010-1234-1234")).toBe(
    "010-1234-1234"
  );
  expect(formatPhoneNumberText("0101234", "010-1234-")).toBe("010-123");

  expect(formatPhoneNumberText("021231234", "02-123-1234")).toBe("02-123-1234");
  expect(formatPhoneNumberText("0212341234", "02-1234-1234")).toBe(
    "02-1234-1234"
  );
  expect(formatPhoneNumberText("02123", "02-123")).toBe("02-123");

  expect(formatPhoneNumberText("03112341234", "031-1234-1234")).toBe(
    "031-1234-1234"
  );
  expect(formatPhoneNumberText("031123", "031-123")).toBe("031-123");

  expect(formatPhoneNumberText("03", "03")).toBe("03");
});

it("formats registration number", () => {
  expect(formatRegistrationNumber("1234567890")).toBe("123-45-67890");
  expect(formatRegistrationNumber("123456789")).toBe("123456789");
});
