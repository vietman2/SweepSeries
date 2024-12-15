export const formatBirthDate = (date: string) => {
  if (date.length === 8) {
    return date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  }
  return date;
};

const formatPhoneNumber = (phonenumber: string) => {
  const digits = phonenumber.replace(/\D/g, "");

  // Formatting for mobile numbers (starts with 010)
  if (digits.startsWith("010")) {
    if (digits.length <= 7) {
      return digits.replace(/(\d{3})(\d{0,4})/, "$1-$2").trim();
    }
    return digits.replace(/(\d{3})(\d{0,4})(\d{0,4})/, "$1-$2-$3").trim();
  }

  // Formatting for Seoul landline numbers (starts with 02)
  if (digits.startsWith("02")) {
    if (digits.length <= 6) {
      return digits.replace(/(\d{2})(\d{0,3})/, "$1-$2").trim();
    }
    if (digits.length <= 9) {
      return digits.replace(/(\d{2})(\d{0,3})(\d{0,4})/, "$1-$2-$3").trim();
    }
    return digits.replace(/(\d{2})(\d{0,4})(\d{0,4})/, "$1-$2-$3").trim();
  }

  // Formatting for other landline numbers (starts with 03x, 04x, 05x, 06x)
  if (/^0[3-6]\d/.test(digits)) {
    if (digits.length <= 7) {
      return digits.replace(/(\d{3})(\d{0,4})/, "$1-$2").trim();
    }
    return digits.replace(/(\d{3})(\d{0,4})(\d{0,4})/, "$1-$2-$3").trim();
  }

  return phonenumber;
};

export const formatPhoneNumberText = (number: string, text: string) => {
  if (
    text.length > 1 &&
    number.length < text.length &&
    text.endsWith("-")
  ) {
    // Remove the last hyphen and reformat
    const newText = number.substring(0, number.length - 1);
    const formattedNumber = formatPhoneNumber(newText);
    return formattedNumber;
  } else {
    // Normal formatting for other cases
    const formattedNumber = formatPhoneNumber(number);
    return formattedNumber;
  }
};

export const formatRegistrationNumber = (number: string) => {
  const digits = number.replace(/\D/g, ""); // Remove non-numeric characters
  const length = digits.length;

  // Apply conditional formatting based on the length of the number
  if (length === 10) {
    return digits.replace(/(\d{3})(\d{2})(\d{0,5})/, "$1-$2-$3");
  }

  return digits;
};

export const formatTime = (time: string) => {
  if (time.length === 4) {
    return time.replace(/(\d{2})(\d{2})/, "$1:$2");
  }
  return time;
};

export const formatPrice = (price: number) => {
  const totalString = price.toString();
  const totalLength = totalString.length;
  let formattedTotal = "";

  for (let i = 0; i < totalLength; i++) {
    // ignore if first character is a minus sign
    if (totalString[i] === "-") {
      formattedTotal += "-";
      continue;
    }
    formattedTotal += totalString[i];
    if ((totalLength - i - 1) % 3 === 0 && i !== totalLength - 1) {
      formattedTotal += ",";
    }
  }

  return formattedTotal;
};
