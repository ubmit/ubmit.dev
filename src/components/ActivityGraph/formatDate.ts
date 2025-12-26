export const formatDate = (dateStr: string) => {
  // Append "T00:00:00" so the date string is parsed at midnight, avoiding timezone-related date shifts.
  const date = new Date(dateStr + "T00:00:00");

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};
