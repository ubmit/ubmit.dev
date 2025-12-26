export const formatDate = (dateStr: string) => {
  // what this T00:00:00 does?
  const date = new Date(dateStr + "T00:00:00");

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};
