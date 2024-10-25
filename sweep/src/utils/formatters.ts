export const formatBirthDate = (date: string) => {
  if (date.length === 8) {
    return date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  }
  return date;
};
