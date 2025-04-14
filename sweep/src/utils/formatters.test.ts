import {
  formatBirthDate,
  formatPhoneNumberText,
  formatMobileNumber,
  formatRegistrationNumber,
  formatTime,
  formatPrice,
  formatDate,
  formatInstagramLink,
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

it("formats mobile number", () => {
  expect(formatMobileNumber("01012341234")).toBe("010-1234-1234");
  expect(formatMobileNumber("0101234")).toBe("0101234");
});

it("formats registration number", () => {
  expect(formatRegistrationNumber("1234567890")).toBe("123-45-67890");
  expect(formatRegistrationNumber("123456789")).toBe("123456789");
});

it("formats time", () => {
  expect(formatTime("1234")).toBe("12:34");
  expect(formatTime("123")).toBe("123");
});

it("formats price", () => {
  expect(formatPrice(1234567890)).toBe("1,234,567,890");
  expect(formatPrice(-32890)).toBe("-32,890");
});

it("formats date", () => {
  expect(formatDate(new Date("2024-12-31"))).toBe("2024.12.31 (화)");
});

it("formats Instagram link", () => {
  expect(formatInstagramLink("https://www.instagram.com/username")).toBe(
    "@username"
  );

  expect(formatInstagramLink(undefined)).toBe("");
});
